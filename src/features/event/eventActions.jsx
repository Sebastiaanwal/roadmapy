import { toastr } from 'react-redux-toastr';
import { FETCH_EVENTS } from './eventConstants';
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../async/asyncActions';
import { createNewEvent } from '../../app/common/util/helpers';
import moment from 'moment';
import firebase from '../../app/config/firebase';
import compareAsc from 'date-fns/compare_asc';
import { debounce } from "debounce";

export const createEvent = event => {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const user = firestore.auth().currentUser;
    const photoURL = getState().firebase.profile.photoURL;
    let newEvent = createNewEvent(user, photoURL, event);
    try {
      let createdEvent = await firestore.add(`events`, {...newEvent});
      await firestore.set(`event_likes/${createdEvent.id}_${user.uid}`, {
        eventId: createdEvent.id,
        userUid: user.uid,
        eventDate: event.date,
        juniorVote: event.juniorVote,
        mediorVote: event.mediorVote,
        seniorVote: event.seniorVote
      });

      toastr.success('Success', 'Event has been created');
    } catch (error) {
      toastr.error('Oops', 'Something went wrong');
    }
  };
};

export const updateEvent = event => {
  return async (dispatch, getState) => {
    dispatch(asyncActionStart());
    const firestore = firebase.firestore();
    try {
      let eventDocRef = firestore.collection('events').doc(event.id);
        await firestore.runTransaction(async (transaction) => {
          await transaction.get(eventDocRef);
          await transaction.update(eventDocRef, event)
        })
      dispatch(asyncActionFinish());
      toastr.success('Success', 'Event has been updated');
    } catch (error) {
      console.log(error);
      dispatch(asyncActionError());
      toastr.error('Oops', 'Something went wrong');
    }
  }
};


export const cancelToggle = (deleted, eventId, history) => async (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  const message = deleted
    ? 'Are you sure you want to delete the event?' 
    : 'This reactivate the event - are you sure?'
  try {
    toastr.confirm(message, {
      onOk: async () => {
        await firestore.update(`events/${eventId}`, {
          deleted: deleted
        })
        await history.goBack();
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const addEventComment = (eventId, values, parentId) => 
  async (dispatch, getState, {getFirebase}) => {
    const firebase = getFirebase();
    const profile = getState().firebase.profile;
    const user = firebase.auth().currentUser;
    let newComment = {
      ownId: parentId,
      parentId: parentId,
      displayName: profile.displayName,
      photoURL: profile.photoURL || '/assets/user.png',
      uid: user.uid,
      text: values.comment,
      date: Date.now(),
      votes: 0
    }
    try {
      await firebase.push(`event_chat/${eventId}`, newComment)
    } catch (error) {
      console.log(error);
      toastr.error('Oops', 'Problem adding comment')
    }
  }

    export const getCategoryEvents = (category, subCategory, lastEvent) => async (dispatch, getState) => {
      const firestore = firebase.firestore();
      const eventsRef = firestore.collection('events');
      try {
        dispatch(asyncActionStart());
        let startAfter =
          lastEvent &&
          (await firestore
            .collection('events')
            .doc(lastEvent.id)
            .get());
        let query;

        if (subCategory) {
        lastEvent
      ? (query = eventsRef
          .where('category', '==', category)
          .where('subCategory', '==', subCategory)
          .where('deleted', '==', false )
          .orderBy('totalCount', 'desc')
          .startAfter(startAfter)
          .limit(5))
      : (query = eventsRef
        .where('category', '==', category)
        .where('subCategory', '==', subCategory)
        .where('deleted', '==', false )
        .orderBy('totalCount', 'desc')
        .limit(5))
        } else {
          lastEvent
      ? (query = eventsRef
          .where('category', '==', category)
          .where('deleted', '==', false )
          .orderBy('totalCount', 'desc')
          .startAfter(startAfter)
          .limit(5))
      : (query = eventsRef
        .where('category', '==', category)
        .where('deleted', '==', false )
        .orderBy('totalCount', 'desc')
        .limit(5))
        }
        let querySnap = await query.get();
    
        if (querySnap.docs.length === 0) {
          dispatch(asyncActionFinish());
          return querySnap;
        }
    
        let events = [];
    
        for (let i = 0; i < querySnap.docs.length; i++) {
          let evt = { ...querySnap.docs[i].data(), id: querySnap.docs[i].id };
          events.push(evt);
        }
        dispatch({ type: FETCH_EVENTS, payload: { events } });
        dispatch(asyncActionFinish());
        return querySnap;
      } catch (error) {
        console.log(error);
        dispatch(asyncActionError());
      }
    };
