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
        increaseLikes(state, action) {
            const id = action.payload
            const blogToUpdate = state.find((blog) => blog.id === id)
            const updatedBlog = {
                ...blogToUpdate,
                likes: blogToUpdate.likes + 1,
            }
            return state.map((blog) => (blog.id === id ? updatedBlog : blog))
        },
        removeBlog(state, action) {
            const id = action.payload
            return state.filter((blog) => blog.id !== id)
        },
    },
})

export const { setBlogs, addBlog, increaseLikes, removeBlog } =
    blogSlice.actions
export default blogSlice.reducer

export const initializeBlogs = () => {
    return async (dispatch) => {
        const blogs = await blogService.getAll()
        dispatch(setBlogs(blogs))
    }
}

export const createBlog = (blogObject, user) => {
    return async (dispatch) => {
        /*         try {
            const newBlog = await blogService.createBlog(blogObject)
        } catch (error) {
            console.log(error.response.data.error)
        } */
        const newBlog = await blogService.createBlog(blogObject)
        const blogWithUser = { ...newBlog, user: user }
        dispatch(addBlog(blogWithUser))
    }
}

export const likeBlog = (id, blogObject) => {
    return async (dispatch) => {
        const blogWithLike = { ...blogObject, likes: blogObject.likes + 1 }
        const likedBlog = await blogService.updateBlog(id, blogWithLike)
        dispatch(increaseLikes(likedBlog.id))
    }
}

export const deleteBlog = (id) => {
    return async (dispatch) => {
        await blogService.deleteBlog(id)
        dispatch(removeBlog(id))
    }
}
