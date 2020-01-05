import positionReducer from './positionReducer'
import authReducer from './authReducer'
import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'

const rootReducer = combineReducers({
    auth: authReducer,
    position: positionReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer
})

export default rootReducer