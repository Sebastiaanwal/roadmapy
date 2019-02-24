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
      await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, {
        eventId: createdEvent.id,
        userUid: user.uid,
        eventDate: event.date,
        host: true
      });
      await firestore.set(`event_likes/${createdEvent.id}_${user.uid}`, {
        eventId: createdEvent.id,
        userUid: user.uid,
        eventDate: event.date,
        host: true,
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
    //moet hier nog een runTransaction functie bij? 
    //Concurrency problemen bij upvoting voorkomen?
    //https://firebase.google.com/docs/firestore/manage-data/transactions
    //of is met debounce het probleen al genoeg verholpen?
    try {
      let eventDocRef = firestore.collection('events').doc(event.id);
      let dateEqual = compareAsc(getState().firestore.ordered.events[0].date.toDate(), event.date);
      if (dateEqual !== 0) {
        let batch = firestore.batch();
        await batch.update(eventDocRef, event);

        let eventAttendeeRef = firestore.collection('event_attendee');
        let eventAttendeeQuery = await eventAttendeeRef.where('eventId', '==', event.id);
        let eventAttendeeQuerySnap = await eventAttendeeQuery.get();

        for (let i = 0; i < eventAttendeeQuerySnap.docs.length; i++) {
          let eventAttendeeDocRef = await firestore.collection('event_attendee').doc(eventAttendeeQuerySnap.docs[i].id);
          await batch.update(eventAttendeeDocRef, {
            eventDate: event.date
          })
        }
        await batch.commit();
      } else {
        await eventDocRef.update(event);
      }
      dispatch(asyncActionFinish());
      toastr.success('Success', 'Event has been updated');
    } catch (error) {
      console.log(error);
      dispatch(asyncActionError());
      toastr.error('Oops', 'Something went wrong');
    }
  }
};


export const cancelToggle = (cancelled, eventId) => async (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  const message = cancelled
    ? 'Are you sure you want to cancel the event?'
    : 'This reactivate the event - are you sure?';
  try {
    toastr.confirm(message, {
      onOk: () =>
        firestore.update(`events/${eventId}`, {
          cancelled: cancelled
        })
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

  export const updateEventComment = (eventId, commentId, newCount) => 
  async (dispatch, getState, {getFirebase}) => {
    console.log(commentId)
    const firebase = getFirebase();
    let newComment = {
      votes: newCount
    }
    try {
      await firebase.update(`event_chat/${eventId}/${commentId}`, newComment)
    } catch (error) {
      console.log(error);
      toastr.error('Oops', 'Problem updating comment')
    }
  }


    export const getCategoryEvents = (category, subCategory, lastEvent) => async (dispatch, getState) => {
      let today = new Date(Date.now());
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
          .where('subCategory', '==', subCategory || 'evencount' )
          
          .orderBy('totalCount', 'desc')
          .startAfter(startAfter)
          .limit(2))
      : (query = eventsRef
        .where('category', '==', category)
        .where('subCategory', '==', subCategory || 'evencount')
       
        .orderBy('totalCount', 'desc')
        .limit(2))
        } else {
          lastEvent
      ? (query = eventsRef
          .where('category', '==', category)
          .orderBy('totalCount', 'desc')
          .startAfter(startAfter)
          .limit(2))
      : (query = eventsRef
        .where('category', '==', category)
        .orderBy('totalCount', 'desc')
        .limit(2))
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