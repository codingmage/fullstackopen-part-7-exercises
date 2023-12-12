import { createSlice } from "@reduxjs/toolkit"
import blogService from "../services/blogs"
import loginService from "../services/login"

const userSlice = createSlice({
    name: "user",
    initialState: null,
    reducers: {
        setUser(state, action) {
            return action.payload
        },
        removeUser(state, action) {
            return null
        },
    },
})

export const { setUser, removeUser } = userSlice.actions
export default userSlice.reducer

export const userLogIn = (username, password) => {
    return async (dispatch) => {
        const user = await loginService.login({
            username,
            password,
        })
        blogService.setToken(user.token)
        dispatch(setUser(user))
        window.localStorage.setItem("loggedInUser", JSON.stringify(user))
    }
}

export const logOutCurrentUser = () => {
    return async (dispatch) => {
        window.localStorage.clear()
        dispatch(removeUser())
        window.location.reload()
    }
}

export const rememberUser = () => {
    return async (dispatch) => {
        const userIsLoggedInJSON = window.localStorage.getItem("loggedInUser")
        if (userIsLoggedInJSON) {
            const user = JSON.parse(userIsLoggedInJSON)
            blogService.setToken(user.token)
            dispatch(setUser(user))
        }
    }
}
