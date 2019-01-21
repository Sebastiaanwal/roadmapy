
import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {

    apiKey: "AIzaSyD0v_zWMr-R4xDeyazkGf1kFUBgV8g7I_0",
    authDomain: "revents-225922.firebaseapp.com",
    databaseURL: "https://revents-225922.firebaseio.com",
    projectId: "revents-225922",
    storageBucket: "revents-225922.appspot.com",
    messagingSenderId: "450312929516"
}

    firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const settings = {
  timestampsInSnapshots: true
}
firestore.settings(settings)


export default firebase;
