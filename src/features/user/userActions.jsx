import moment from 'moment';
import { toastr } from 'react-redux-toastr';
import cuid from 'cuid';
import { asyncActionError, asyncActionStart, asyncActionFinish } from '../async/asyncActions';
import firebase from '../../app/config/firebase';
import { FETCH_EVENTS } from '../event/eventConstants';
import { debounce } from "debounce";

export const updateProfile = user => async (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();
  const { isLoaded, isEmpty, ...updatedUser } = user;
  if (updatedUser.dateOfBirth !== getState().firebase.profile.dateOfBirth) {
    updatedUser.dateOfBirth = moment(updatedUser.dateOfBirth).toDate();
  }

  try {
    await firebase.updateProfile(updatedUser);
    toastr.success('Success', 'Profile updated');
  } catch (error) {
    console.log(error);
  }
};

export const uploadProfileImage = (file, fileName) => async (dispatch, getState, { getFirebase, getFirestore }) => {
  const imageName = cuid();
  const firebase = getFirebase();
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;
  const path = `${user.uid}/user_images`;
  const options = {
    name: imageName
  };
  try {
    dispatch(asyncActionStart());
    // upload the file to fb storage
    let uploadedFile = await firebase.uploadFile(path, file, null, options);
    // get url of image
    let downloadURL = await uploadedFile.uploadTaskSnapshot.downloadURL;
    // get the userdoc from firestore
    let userDoc = await firestore.get(`users/${user.uid}`);
    // check if user has photo, if not update profile
    if (!userDoc.data().photoURL) {
      await firebase.updateProfile({
        photoURL: downloadURL
      });
      await user.updateProfile({
        photoURL: downloadURL
      });
    }
    // add the new photo to photos collection
    await firestore.add(
      {
        collection: 'users',
        doc: user.uid,
        subcollections: [{ collection: 'photos' }]
      },
      {
        name: imageName,
        url: downloadURL
      }
    );
    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
    throw new Error('Problem uploading photo');
  }
};

export const deletePhoto = photo => async (dispatch, getState, { getFirebase, getFirestore }) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;
  try {
    await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`);
    await firestore.delete({
      collection: 'users',
      doc: user.uid,
      subcollections: [{ collection: 'photos', doc: photo.id }]
    });
  } catch (error) {
    console.log(error);
    throw new Error('Problem deleting the photo');
  }
};

export const setMainPhoto = photo => async (dispatch, getState) => {
  dispatch(asyncActionStart())
  const firestore = firebase.firestore();
  const user = firebase.auth().currentUser;
  const today = new Date(Date.now());
  let userDocRef = firestore.collection('users').doc(user.uid);
  let eventAttendeeRef = firestore.collection('event_attendee');
  try {
    let batch = firestore.batch();

    await batch.update(userDocRef, {
      photoURL: photo.url
    });

    let eventQuery = await eventAttendeeRef.where('userUid', '==', user.uid).where('eventDate', '>', today);

    let eventQuerySnap = await eventQuery.get();

    for (let i=0; i<eventQuerySnap.docs.length; i++) {
      let eventDocRef = await firestore.collection('events').doc(eventQuerySnap.docs[i].data().eventId)
      let event = await eventDocRef.get();
      if (event.data().hostUid === user.uid) {
        batch.update(eventDocRef, {
          hostPhotoURL: photo.url,
          [`attendees.${user.uid}.photoURL`]: photo.url
        })
      } else {
        batch.update(eventDocRef, {
          [`attendees.${user.uid}.photoURL`]: photo.url
        })
      }
    }
    console.log(batch);
    await batch.commit();
    dispatch(asyncActionFinish())
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError())
    throw new Error('Problem setting main photo');
  }
};

export const updatingCategoryLike = (event) => async (dispatch, getState) => {
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

export const cancelGoingToEvent = event => async (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  const user = firestore.auth().currentUser;
  try {
    await firestore.update(`events/${event.id}`, {
      [`attendees.${user.uid}`]: firestore.FieldValue.delete()
    });
    await firestore.delete(`event_attendee/${event.id}_${user.uid}`);
    toastr.success('Success', 'You have removed yourself from the event');
  } catch (error) {
    console.log(error);
    toastr.error('Oops', 'something went wrong');
  }
};

export const getUserEvents = (userUid, subCategory) => async (dispatch, getState) => {
  dispatch(asyncActionStart());
  const firestore = firebase.firestore();
  const eventsRef = firestore.collection('events');
  let query;
  if (subCategory) {
      query = eventsRef
        .where('hostUid', '==', userUid)
        .where('subCategory', '==', subCategory)
        .orderBy('totalCount', 'desc');
   } else {
      query = eventsRef.where('hostUid', '==', userUid).orderBy('totalCount', 'desc');
  }
  try {
    let querySnap = await query.get();
    let events = [];

    for (let i = 0; i < querySnap.docs.length; i++) {
      let evt = await firestore
        .collection('events')
        .doc(querySnap.docs[i].data().eventId)
        .get();
      events.push({ ...evt.data(), id: evt.id });
    }

    dispatch({ type: FETCH_EVENTS, payload: { events } });

    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
};

export const followUser = userToFollow => async (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  const user = firestore.auth().currentUser;
  const following = {
    photoURL: userToFollow.photoURL || '/assets/user.png',
    city: userToFollow.city || 'unknown city',
    displayName: userToFollow.displayName
  };
  try {
    await firestore.set(
      {
        collection: 'users',
        doc: user.uid,
        subcollections: [{ collection: 'following', doc: userToFollow.id }]
      },
      following
    );
  } catch (error) {
    console.log(error);
  }
};

export const unfollowUser = userToUnfollow => async (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  const user = firestore.auth().currentUser;
  try {
    await firestore.delete({
      collection: 'users',
      doc: user.uid,
      subcollections: [{ collection: 'following', doc: userToUnfollow.id }]
    });
  } catch (error) {
    console.log(error);
  }
};

/* export const getUsers = () => async (dispatch, getState) => {
  const firestore = firebase.firestore();
  const eventsRef = firestore.collection('users');
  try {
    dispatch(asyncActionStart());

    query = eventsRef
    .orderBy('totalCount', 'desc')
    .limit(3)
    
    let querySnap = await query.get();

    let users = [];

    for (let i = 0; i < querySnap.docs.length; i++) {
      let evt = { ...querySnap.docs[i].data(), id: querySnap.docs[i].id };
      users.push(evt);
    }
    dispatch({ type: FETCH_USERS, payload: { users } });
    return querySnap;
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
}; */