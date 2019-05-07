import { toastr } from 'react-redux-toastr';
import { FETCH_EVENTS } from './eventConstants';
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../async/asyncActions';
import { createNewEvent } from '../../app/common/util/helpers';
import moment from 'moment';
import firebase from '../../app/config/firebase';
import compareAsc from 'date-fns/compare_asc';
import { debounce } from "debounce";
import { objectToArray } from '../../app/common/util/helpers';


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

    //Als op de button klikt moet 1 van de drie functies gaan
    //argumenten: event, 

    //bijv. de junior functie moeten checken of checken de event_like voor deze UID al bestaat. 
    //Bestaat het niet dan die info gebruiken en verwerken in object voor event en object voor event_like
    //zowel het event en event_like object toevoegen/upgraden binnen een transaction.

    //bestaat de event_like voor deze UID?
    //get het object en check in dit object voor welke sub-cat al geliked is
  // het kan ook zijn dat het object dus bestaat bij event_like maar dat alles weer op neutraal staat omdat er weer is terug geklikt. 

    //vervolgens gebruik je deze info bij het aanpassen van een nieuw object
    //het nieuwe object wordt gepushed naar het event_like object
    //en het event wordt geincrmenteerd met +1

    //Maak een cloud function voor het updaten van de totale score.


    export const juniorButton = event => async (dispatch, getState) => {
      const user = firebase.auth().currentUser
      const firestore = firebase.firestore();
      const eventLike = {
        setDate: Date.now(),
        id: user.uid, 
        juniorVote: true,
        mediorVote: false, 
        seniorVote: false
        };
        dispatch(asyncActionStart());
        try {
          let eventLikeDocRef = firestore.collection('event_likes').doc(`${event.id}_${user.uid}`);
          let eventDocRef = firestore.collection('events').doc(event.id)

          increment = firebase.firestore.FieldValue.increment(1)
         
          let documentSnapshot = await eventLikeDocRef.get();

          await firestore.runTransaction(async (transaction) => {
              await transaction.get(eventDocRef)
              if (documentSnapshot.exists) {
                console.log('het werkt bram')
              } else {
                console.log('het werkt nietttttt bram')
                await transaction.update(eventDocRef, {
                  [`likes.${user.uid}`]: eventLike,
                  totalCount: event.totalCount =+ 1,
                  juniorCount: event.juniorCount =+ 1
                })
                await transaction.set(eventLikeDocRef, {
                  eventLike
                })
              }
           })
          dispatch(asyncActionFinish());
          toastr.success('Success', 'Event has been updated');
        } catch (error) {
          console.log(error);
          dispatch(asyncActionError());
          toastr.error('Oops', 'Something went wrong');
        }
      };

/*     export const updatingCategoryLike = (event) => async (dispatch, getState) => {
      dispatch(asyncActionStart())
      const firestore = firebase.firestore();
      const user = firebase.auth().currentUser;
      const profile = getState().firebase.profile;
      const userProfile = {
        going: true,
        joinDate: Date.now(),
        photoURL: profile.photoURL || '/assets/user.png',
        displayName: profile.displayName,
        host: false,
        id: user.uid, 
        juniorVote: event.juniorVote,
        mediorVote: event.mediorVote, 
        seniorVote: event.seniorVote
        };
      try {
        let eventDocRef = firestore.collection('events').doc(event.id);
        let eventAttendeeDocRef = firestore.collection('event_likes').doc(`${event.id}_${user.uid}`);
    
        await firestore.runTransaction(async (transaction) => {
          await transaction.get(eventDocRef);
          await transaction.update(eventDocRef, {
            [`likes.${user.uid}`]: userProfile
          })
          await transaction.set(eventAttendeeDocRef, {
            eventId: event.id,
            userUid: user.uid,
            eventDate: event.date,
            host: false,
            likedSubCategory: event.subCategory,
          })
        })
        dispatch(asyncActionFinish())
        toastr.success('Success', 'You have signed up to the event');
      } catch (error) {
        console.log(error);
        dispatch(asyncActionError())
        toastr.error('Oops', 'Problem signing up to event');
      }
    }

    // Create a reference to the SF doc.
var sfDocRef = db.collection("cities").doc("SF");

db.runTransaction(function(transaction) {
    return transaction.get(sfDocRef).then(function(sfDoc) {
        if (!sfDoc.exists) {
            throw "Document does not exist!";
        }

        var newPopulation = sfDoc.data().population + 1;
        if (newPopulation <= 1000000) {
            transaction.update(sfDocRef, { population: newPopulation });
            return newPopulation;
        } else {
            return Promise.reject("Sorry! Population is too big.");
        }
    });
}).then(function(newPopulation) {
    console.log("Population increased to ", newPopulation);
}).catch(function(err) {
    // This will be an "population is too big" error.
    console.error(err);
}); */