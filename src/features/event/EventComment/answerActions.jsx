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

    export const setAnswer = (answer, event) => async (dispatch, getState) => {
      dispatch(asyncActionStart())
      const firestore = firebase.firestore();
      const user = firebase.auth().currentUser;
      const profile = getState().firebase.profile;
      const userProfile = {
        displayName: profile.displayName,
        id: user.uid, 
        };
      try {
        let eventDocRef = firestore.collection('events').doc(event.id);
        let eventAttendeeDocRef = firestore.collection('event_answer').doc(`${event.id}_${user.uid}`);
        const id = event.id + "_" + user.uid
        await firestore.runTransaction(async (transaction) => {
          await transaction.get(eventDocRef);
          await transaction.update(eventDocRef, {
            [`Answer.${user.uid}`]: userProfile
          })
          await transaction.set(eventAttendeeDocRef, {
            eventId: event.id,
            userUid: user.uid,
            eventDate: event.date,
            host: false,
            votes: 0,
            date: Date.now(),
            photoURL: profile.photoURL || '/assets/user.png',
            displayName: profile.displayName,
            host: false,
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


    export const updateAnswer= (answer, event) => async (dispatch, getState) => {
      dispatch(asyncActionStart())
      const firestore = firebase.firestore();
      const user = firebase.auth().currentUser;
      const profile = getState().firebase.profile;
      const userProfile = {
        displayName: profile.displayName,
        id: user.uid, 
        };
      try {
        let eventDocRef = firestore.collection('events').doc(event.id);
        let eventAttendeeDocRef = firestore.collection('event_answer').doc(`${event.id}_${user.uid}`);
    
        await firestore.runTransaction(async (transaction) => {
          await transaction.get(eventDocRef);
          await transaction.update(eventDocRef, {
            [`Answer.${user.uid}`]: userProfile
          })
          await transaction.set(eventAttendeeDocRef, {
            eventId: event.id,
            userUid: user.uid,
            eventDate: event.date,
            host: false,
            editedDate: Date.now(),
            photoURL: profile.photoURL || '/assets/user.png',
            displayName: profile.displayName,
            host: false,
            id: user.uid, 
            text: answer.text    
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