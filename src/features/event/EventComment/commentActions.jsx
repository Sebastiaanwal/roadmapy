import { toastr } from 'react-redux-toastr';
import { FETCH_COMMENTS } from './commentConstants';
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../../async/asyncActions';
import firebase from '../../../app/config/firebase';

    export const getComments = (pageId, lastEvent) => async (dispatch, getState) => {
      const firestore = firebase.firestore();
      const eventsRef = firestore.collection('event_comment');
      console.log(pageId)
      try {
        dispatch(asyncActionStart());
        let startAfter =
          lastEvent &&
          (await firestore
            .collection('event_comment')
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
    
        let comments = [];
    
        for (let i = 0; i < querySnap.docs.length; i++) {
          let evt = { ...querySnap.docs[i].data(), id: querySnap.docs[i].id };
          comments.push(evt);
        }
        dispatch({ type: FETCH_COMMENTS, payload: { comments } });
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

    export const setComment = (comment, eventId) => async (dispatch, getState) => {
      dispatch(asyncActionStart())
      const firestore = firebase.firestore();
      const user = firebase.auth().currentUser;
      const profile = getState().firebase.profile;
      const userProfile = {
        displayName: profile.displayName,
        id: user.uid, 
        };
      try {
        let eventDocRef = firestore.collection('events').doc(eventId);
        let eventAttendeeDocRef = firestore.collection('event_comment').doc(`${eventId}_${user.uid}`);
        const id = eventId+"_" +user.uid
        await firestore.runTransaction(async (transaction) => {
          await transaction.get(eventDocRef);
          await transaction.update(eventDocRef, {
            [`comments.${user.uid}`]: userProfile
          })
          await transaction.set(eventAttendeeDocRef, {
            eventId: eventId,
            uid: user.uid,
            date: Date.now(),
            photoURL: profile.photoURL || '/assets/user.png',
            displayName: profile.displayName,
            id: id, 
            description: comment.description,
          })
        })
        dispatch(asyncActionFinish())
        toastr.success('Success', 'You added your comment');
      } catch (error) {
        console.log(error);
        dispatch(asyncActionError())
        toastr.error('Oops', 'Problem adding your comment');
      }
    }


  export const updateVoter = (answer) => async (dispatch, getState) => {
    dispatch(asyncActionStart())
    const firestore = firebase.firestore();
    const user = firebase.auth().currentUser;
    const id = answer.eventId+"_"+user.uid
    const userProfile = {
      id: id,
      joinDate: Date.now(),
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
          eventDate: Date.now(),
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