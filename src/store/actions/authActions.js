export const signIn = () => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
       const firebase = getFirebase()
       const firestore = getFirestore()
       firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()
       ).then((resp) => {
           if (resp.additionalUserInfo.isNewUser) {
            firestore.collection('portfolios').add({
                name: 'Main portfolio ' + resp.additionalUserInfo.profile.name ,
              }).then(ref => {
                return firestore.collection('users').doc(resp.user.uid).set(
                    {portfolioId: ref.id}, { merge: true }
                )
              })      
           }
        }).then(() => {
            dispatch({ type: 'LOGIN_SUCCESS' })
       }).catch((err) => {
           console.log(err)
           dispatch({ type: 'LOGIN_ERROR', err})
       })
    }
}

export const signOut = () => {
    return (dispatch, getState, { getFirebase }) => {
       const firebase = getFirebase()
       firebase.auth().signOut(
       ).then(() => {
           dispatch({ type: 'SIGNOUT_SUCCESS' })
       })
    }
}