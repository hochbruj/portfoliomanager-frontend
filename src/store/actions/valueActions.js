const axios = require('axios');

export const updateValues = () => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make async call to API
        axios({
            method: 'post',
            url: process.env.REACT_APP_API_URL + '/updateValues',
            headers: {
				"Content-Type": "application/json",
			},
        })
            .then(function (response) {
                // handle success
                let result = response.data
                dispatch({ type: 'GET_UPDATE_RESULT', result })
            }).catch((err) => {
                console.log(err)
            })
    }
}

export const resetValues = () => {
    console.log("RESET")
    return {
        type: 'RESET_UPDATE_RESULT'
    }
}


