const initState = {
    positions: [],
    dates: [],
    yearIndex: 0,
    values: [],
    updateRun: null,
    chart: null
}

const positionReducer = (state = initState, action) => {
    switch (action.type) {
        case 'CREATE_POSITION':
            console.log("created Position", action.position)
            return state
        case 'CREATE_POSITION_ERROR':
            console.log("create Position error", action.error)
            return state
        case 'UPDATE_POSITION':
            console.log("updates Position", action.position)
            return state
        case 'UPDATE_POSITION_ERROR':
            console.log("update position error", action.error)
            return state
        case 'GET_POSITIONS':
            console.log("got positions")
            return {
                ...state,
                positions: action.positions
            }
        case 'GET_DATES':
            console.log("got dates")
            return {
                ...state,
                dates: action.dates,
                yearIndex: action.yearIndex
            }
        case 'GET_VALUES':
            console.log("got values")
            return {
                ...state,
                values: action.values
            }
        case 'GET_UPDATE_RESULT':
            console.log("updated values")
            return {
                ...state,
                updateRun: action.result
            }
        case 'RESET_UPDATE_RESULT':
            console.log("update result reset")
            return {
                ...state,
                updateRun: initState.updateRun
            }
            case 'GET_CHART':
                console.log("got chart data")
                return {
                    ...state,
                    chart: action.chart
                }
        default:
            return state
    }
}

export default positionReducer