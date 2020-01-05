export const createPosition = (position) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make async call to API
        const firestore = getFirestore()
        const profile = getState().firebase.profile
        firestore.collection('positions').add({
            ...position,
            portfolioId: profile.portfolioId,
            createdAt: new Date()
        }).then(() => {
            dispatch({ type: 'CREATE_POSITION', position })
            dispatch(getPositions(profile.portfolioId))
        }).catch((error) => {
            dispatch({ type: 'CREATE_POSITION_ERROR', error })
        })

    }
}

export const updatePosition = (position) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make async call to API
        const firestore = getFirestore()
        firestore.collection('positions').doc(position.id)
            .update({ amount: position.amount })
            .then(() => {
                dispatch({ type: 'UPDATE_POSITION', position })
            }).catch((err) => {
                dispatch({ type: 'UPDATE_POSITION_ERROR', err })
            })

    }
}

export const getPositions = (portfolioId) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore()
        firestore.collection("positions").where('portfolioId', '==', portfolioId)
            .get()
            .then(function (querySnapshot) {
                let positions = []
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    let position = doc.data()
                    position.id = doc.id
                    positions.push(position)
                });
                dispatch({ type: 'GET_POSITIONS', positions })
            })
            .catch(function (error) {
                dispatch({ type: 'GET_POSITIONS_ERROR', error })
            });
    }
}

export const getDates = () => {
    return (dispatch, getState, { getFirestore }) => {
        const firestore = getFirestore()
        firestore.collection("fetchedQuotes").doc('dates')
            .get()
            .then(doc => {
                let dates = doc.data().dates
                let yearIndex = 0
                dates.sort(function (a, b) { return a.seconds - b.seconds });
                for (const [index, date] of dates.entries()) {
                    if (date.seconds >= dates[dates.length - 1].seconds - 31536000) {
                        yearIndex = index
                        break
                    }
                }
                dispatch({ type: 'GET_DATES', dates, yearIndex })
            })
            .catch(function (error) {
                dispatch({ type: 'GET_DATES_ERROR', error })
            });
    }
}

export const getValues = (portfolioId) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore()
        firestore.collection("values").where('portfolioId', '==', portfolioId)
            .get()
            .then(function (querySnapshot) {
                let values = []
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    let value = doc.data()
                    value.id = doc.id
                    values.push(value)
                });
                dispatch({ type: 'GET_VALUES', values })
            })
            .catch(function (error) {
                dispatch({ type: 'GET_VALUES_ERROR', error })
            });
    }
}

export const getChart = (name,data) => {
    let chart = {name,data}
    return {
        type: 'GET_CHART',
        chart: chart

    }
}



