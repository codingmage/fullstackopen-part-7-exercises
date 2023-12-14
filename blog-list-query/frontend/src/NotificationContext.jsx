import { createContext, useReducer } from "react"

const initialState = { content: "", kind: "" }

const notificationReducer = (state, action) => {
    switch (action.type) {
        case "SET":
            return action.payload
        case "RESET":
            return initialState
        default:
            return state
    }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, dispatch] = useReducer(
        notificationReducer,
        initialState
    )

    return (
        <NotificationContext.Provider value={[notification, dispatch]}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export default NotificationContext
