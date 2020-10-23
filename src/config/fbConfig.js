import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = require('../secrets/firebaseConfig.json');

firebase.initializeApp(config);

export default firebase;
