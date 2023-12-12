import { createSlice } from "@reduxjs/toolkit"
import blogService from "../services/blogs"

const blogSlice = createSlice({
    name: "blogs",
    initialState: [],
    reducers: {
        setBlogs(state, action) {
            return action.payload
        },
        addBlog(state, action) {
            return [...state, action.payload]
        },
    },
})

export const { setBlogs, addBlog } = blogSlice.actions
export default blogSlice.reducer

export const initializeBlogs = () => {
    return async (dispatch) => {
        const blogs = await blogService.getAll()
        dispatch(setBlogs(blogs))
    }
}

export const createBlog = (blogObject, user) => {
    return async (dispatch) => {
        const newBlog = await blogService.createBlog(blogObject)
        const blogWithUser = { ...newBlog, user: user }
        dispatch(addBlog(blogWithUser))
    }
}
