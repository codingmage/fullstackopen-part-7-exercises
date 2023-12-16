import axios from "axios"
const baseUrl = "/api/blogs"

let token = null

const setToken = (newToken) => {
    token = `Bearer ${newToken}`
}

export const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then((response) => response.data)
}

export const createBlog = async (newBlog) => {
    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.post(baseUrl, newBlog, config)
    return response.data
}

export const updateBlog = async (blog) => {
    const response = await axios.put(`${baseUrl}/${blog.id}`, blog)
    return response.data
}

export const deleteBlog = async (id) => {
    const config = {
        headers: { Authorization: token },
    }

    await axios.delete(`${baseUrl}/${id}`, config)
}

export default {
    /* getAll, createBlog, */ setToken /* deleteBlog, */,
    /* updateBlog */
}
