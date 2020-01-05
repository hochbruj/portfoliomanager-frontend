import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'


var config =  {
// Your web app's Firebase configuration goes here   
    }

firebase.initializeApp(config)

export default firebase