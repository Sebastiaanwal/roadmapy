import { toastr } from 'react-redux-toastr';
import { FETCH_ANSWERS } from './answerConstants';
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../../async/asyncActions';
import firebase from '../../../app/config/firebase';

    export const getAnswers = (pageId, lastEvent) => async (dispatch, getState) => {
      const firestore = firebase.firestore();
      const eventsRef = firestore.collection('event_answer');
      console.log(pageId)
      try {
        dispatch(asyncActionStart());
        let startAfter =
          lastEvent &&
          (await firestore
            .collection('event_answer')
            .doc(lastEvent.id)
            .get());
        let query;
        lastEvent
          ? (query = eventsRef
              .where('eventId', '==', pageId)
              .orderBy('votes', 'desc')
              .startAfter(startAfter)
              .limit(2))
          : (query = eventsRef
              .where('eventId', '==', pageId)
              .orderBy('votes', 'desc')
              .limit(2));
    
        let querySnap = await query.get();
    
        if (querySnap.docs.length === 0) {
          dispatch(asyncActionFinish());
          return querySnap;
        }
    
        let answers = [];
    
        for (let i = 0; i < querySnap.docs.length; i++) {
          let evt = { ...querySnap.docs[i].data(), id: querySnap.docs[i].id };
          answers.push(evt);
        }
        dispatch({ type: FETCH_ANSWERS, payload: { answers } });
        dispatch(asyncActionFinish());
        return querySnap;
      } catch (error) {
        console.log(error);
        dispatch(asyncActionError());
      }
    };


    //updateAndSetAnswer niet gebruiken voor comments die mensen kunnen geven op answers en de hoofdvraag in het event. 
    //Answers zijn namelijk uniek, en comments kunnen mensen vaker geven. Er moet dus gecheckt worden of de comment eerder is gegeven.
    //vervolgens moet er een getal worden toegevoegd aan de combinatie event.id_user.id+2 om het uniek te houden. 

    export const setAnswer = (answer, eventId) => async (dispatch, getState) => {
      dispatch(asyncActionStart())
      const firestore = firebase.firestore();
      const user = firebase.auth().currentUser;
      const profile = getState().firebase.profile;
      const userProfile = {
        displayName: profile.displayName,
        id: user.uid,
        setDate: Date.now()
        };
      try {
        let eventDocRef = firestore.collection('events').doc(eventId);
        let eventAttendeeDocRef = firestore.collection('event_answer').doc(`${eventId}_${user.uid}`);
        const id = eventId+"_" +user.uid
        await firestore.runTransaction(async (transaction) => {
          await transaction.get(eventDocRef);
          await transaction.update(eventDocRef, {
            [`answers.${user.uid}`]: userProfile
          })
          await transaction.set(eventAttendeeDocRef, {
            eventId: eventId,
            uid: user.uid,
            votes: 0,
            setDate: Date.now(),
            photoURL: profile.photoURL || '/assets/user.png',
            displayName: profile.displayName,
            id: id, 
            description: answer.description,
            title_link: answer.title_link,
            url: answer.url
          })
        })
        dispatch(asyncActionFinish())
        toastr.success('Success', 'You added your answer');
      } catch (error) {
        console.log(error);
        dispatch(asyncActionError())
        toastr.error('Oops', 'Problem adding your answer');
      }
    }


    export const updateAnswer = (answer) => async (dispatch, getState) => {
      dispatch(asyncActionStart())
      const profile = getState().firebase.profile;
      const firestore = firebase.firestore();
      const userProfile = {
        displayName: profile.displayName,
        updateDate: Date.now()
        };
      try {
        let eventDocRef = firestore.collection('events').doc(answer.eventId);
        let eventAttendeeDocRef = firestore.collection('event_answer').doc(`${answer.id}`);
    
        await firestore.runTransaction(async (transaction) => {
          await transaction.get(eventDocRef);
          await transaction.update(eventDocRef, {
            [`answers.${answer.uid}`]: userProfile
          })
          await transaction.update(eventAttendeeDocRef, {
            updateDate: Date.now(),
            description: answer.description,
            title_link: answer.title_link,
            url: answer.url
          })
        })
        dispatch(asyncActionFinish())
        toastr.success('Success', 'Your vote has been registerd');
      } catch (error) {
        console.log(error);
        dispatch(asyncActionError())
        toastr.error('Oops', 'Problem registering your vote');
      }
    }

    export const updateAnswerVote = (answer) => { 

      return async (dispatch, getState) => {
      dispatch(asyncActionStart())
      const firestore = firebase.firestore();
      const user = firebase.auth().currentUser;
      try {
        let eventAttendeeDocRef = firestore.collection('event_answer').doc(answer.id);
    
        await eventAttendeeDocRef.update({votes: answer.votes})
        dispatch(asyncActionFinish())
        toastr.success('Success', 'You added your  vote');
      } catch (error) {
        console.log(error);
        dispatch(asyncActionError())
        toastr.error('Oops', 'Problem adding your answer vote');
      }
    }
  }


  export const updateVoter = (answer) => async (dispatch, getState) => {
    dispatch(asyncActionStart())
    const firestore = firebase.firestore();
    const user = firebase.auth().currentUser;
    const id = answer.eventId+"_"+user.uid
    const userProfile = {
      id: id,
      setDate: Date.now(),
      uid: user.uid, 
      voteUser: answer.voteUser
      };
    try {
      let eventDocRef = firestore.collection('event_answer').doc(answer.id);
      let eventAttendeeDocRef = firestore.collection('answer_votes').doc(`${answer.eventId}_${user.uid}`);
  
      await firestore.runTransaction(async (transaction) => {
        await transaction.get(eventDocRef);
        await transaction.update(eventDocRef, {
          [`voters.${user.uid}`]: userProfile
        })
        await transaction.set(eventAttendeeDocRef, {
          eventId: answer.eventId,
          uid: user.uid,
          setDate: Date.now(),
          voteUser: answer.voteUser
        })
      })
      dispatch(asyncActionFinish())
      toastr.success('Success', 'Your vote has been registerd');
    } catch (error) {
      console.log(error);
      dispatch(asyncActionError())
      toastr.error('Oops', 'Problem registering your vote');
    }
  }


  export const deleteAnswer = (answer, history) => async (dispatch, getState, { getFirestore }) => {
    dispatch(asyncActionStart())
    const firestore = getFirestore();
    const user = firestore.auth().currentUser;
    const message = 'Are you sure you want to delete the comment?'

    try { toastr.confirm(message, {
      onOk: async () => {    
        await firestore.delete(`event_answer/${answer.id}`);
        await firestore.update(`events/${answer.eventId}`, {
          [`answers.${user.uid}`]: firestore.FieldValue.delete()
          })
      await history.go();
        }
      })
    } catch (error) {
      console.log(error);
      dispatch(asyncActionError())
      toastr.error('Oops', 'Problem deleted your answer');
    }
  }