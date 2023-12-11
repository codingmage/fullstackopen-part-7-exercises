import { createSlice } from '@reduxjs/toolkit'

const initialState = { content: '', kind: '' }

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        changeNotification(state, action) {
            return action.payload
        },
        resetNotification(state, action) {
            return initialState
        },
    },
})

export const setNotification = (object) => {
    return (dispatch) => {
        dispatch(changeNotification(object))
        setTimeout(() => {
            dispatch(resetNotification())
        }, 5000)
    }
}

export const { changeNotification, resetNotification } =
    notificationSlice.actions

export default notificationSlice.reducer
