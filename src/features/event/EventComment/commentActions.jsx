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
              .orderBy('setDate', 'desc')
              .startAfter(startAfter)
              .limit(2))
          : (query = eventsRef
              .where('eventId', '==', pageId)
              .orderBy('setDate', 'desc')
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
        const randomNum = Math.random()
        const DocRef = `${eventId}_${user.uid}_${randomNum}`
        let eventDocRef = firestore.collection('events').doc(eventId);
        let eventAttendeeDocRef = firestore.collection('event_comment').doc(DocRef);
        await firestore.runTransaction(async (transaction) => {
          await transaction.get(eventDocRef);
          await transaction.update(eventDocRef, {
            [`comments.${user.uid}`]: userProfile
          })
          await transaction.set(eventAttendeeDocRef, {
            eventId: eventId,
            uid: user.uid,
            setDate: Date.now(),
            photoURL: profile.photoURL || '/assets/user.png',
            displayName: profile.displayName,
            id: DocRef, 
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

    export const updateComment = (comment) => async (dispatch, getState) => {
      dispatch(asyncActionStart())
      const firestore = firebase.firestore();
      const user = firebase.auth().currentUser;
      const profile = getState().firebase.profile;
      const userProfile = {
        displayName: profile.displayName,
        id: user.uid, 
        };
      try {
        let eventDocRef = firestore.collection('events').doc(comment.eventId);
        let eventAttendeeDocRef = firestore.collection('event_comment').doc(comment.id);
        await firestore.runTransaction(async (transaction) => {
          await transaction.get(eventDocRef);
          await transaction.update(eventDocRef, {
            [`comments.${user.uid}`]: userProfile
          })
          await transaction.update(eventAttendeeDocRef, {
            uid: user.uid,
            updateDate: Date.now(),
            photoURL: profile.photoURL || '/assets/user.png',
            displayName: profile.displayName,
            description: comment.description,
          })
        })
        dispatch(asyncActionFinish())
        toastr.success('Success', 'You changed your comment');
      } catch (error) {
        console.log(error);
        dispatch(asyncActionError())
        toastr.error('Oops', 'Problem changing your comment');
      }
    }


    export const deleteComment = (comment, history) => async (dispatch, getState, { getFirestore }) => {
      dispatch(asyncActionStart())
      const firestore = getFirestore();
      const user = firestore.auth().currentUser;
      const message = 'Are you sure you want to delete the comment?'
      try { toastr.confirm(message, {
        onOk: async () => {
        await firestore.delete(`event_comment/${comment.id}`)
        await firestore.update(`events/${comment.eventId}`, {
            [`comments.${user.uid}`]: firestore.FieldValue.delete()
            })
        await history.go();
          }
        })
      } catch (error) {
        console.log(error);
        dispatch(asyncActionError())
        toastr.error('Oops', 'Problem deleted your comment');
      }
    }

  