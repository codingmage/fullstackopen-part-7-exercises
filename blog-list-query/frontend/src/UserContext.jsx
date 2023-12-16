import { createContext, useContext, useReducer } from "react"

const loggedUserReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return action.payload
        case "LOGOUT":
            return null
        default:
            return state
    }
}

const LoggedUserContext = createContext()

export const LoggedUserContextProvider = (props) => {
    const [loggedUser, dispatch] = useReducer(loggedUserReducer, null)

    return (
        <LoggedUserContext.Provider value={[loggedUser, dispatch]}>
            {props.children}
        </LoggedUserContext.Provider>
    )
}

export const useLoggedUserValue = () => {
    const userAndDispatch = useContext(LoggedUserContext)
    return userAndDispatch[0]
}

export const useLoggedUserDispatch = () => {
    const userAndDispatch = useContext(LoggedUserContext)
    return userAndDispatch[1]
}
