import { createSlice } from "@reduxjs/toolkit"
import blogService from "../services/blogs"
import { setNotification } from "./notificationReducer"

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
        setBlogComment(state, action) {
            const id = action.payload.id
            const blogToUpdate = state.find((blog) => blog.id === id)
            const updatedBlog = {
                ...blogToUpdate,
                comments: [
                    ...blogToUpdate.comments,
                    action.payload.responseComment,
                ],
            }
            return state.map((blog) => (blog.id === id ? updatedBlog : blog))
        },
    },
})

export const { setBlogs, addBlog, increaseLikes, removeBlog, setBlogComment } =
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
        try {
            const newBlog = await blogService.createBlog(blogObject)
            const blogWithUser = { ...newBlog, user: user }
            dispatch(addBlog(blogWithUser))
            dispatch(
                setNotification({
                    content: `new blog ${blogObject.title} added`,
                    kind: "info",
                })
            )
        } catch (error) {
            dispatch(
                setNotification({
                    content: `could not add blog. ${error}`,
                    kind: "error",
                })
            )
        }
    }
}

export const likeBlog = (id, blogObject) => {
    return async (dispatch) => {
        try {
            const blogWithLike = { ...blogObject, likes: blogObject.likes + 1 }
            const likedBlog = await blogService.updateBlog(id, blogWithLike)
            dispatch(increaseLikes(likedBlog.id))
            dispatch(
                setNotification({
                    content: `liked blog ${blogObject.title}`,
                    kind: "info",
                })
            )
        } catch (error) {
            dispatch(
                setNotification({
                    content: `could not update likes. ${error}`,
                    kind: "error",
                })
            )
        }
    }
}

export const deleteBlog = (id, name) => {
    return async (dispatch) => {
        try {
            await blogService.deleteBlog(id)
            dispatch(removeBlog(id))
            dispatch(
                setNotification({
                    content: `blog ${name} deleted`,
                    kind: "info",
                })
            )
        } catch (error) {
            setNotification({
                content: `could not delete blog. ${error}`,
                kind: "error",
            })
        }
    }
}

export const postComment = (comment, id) => {
    return async (dispatch) => {
        try {
            console.log(id)
            const responseComment = await blogService.commentOnBlog(comment, id)
            dispatch(setBlogComment({ responseComment, id }))
        } catch (error) {
            console.log(error)
            setNotification({
                content: `could not add comment. ${error}`,
                kind: "error",
            })
        }
    }
}
