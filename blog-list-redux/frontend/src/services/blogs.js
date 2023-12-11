import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
    token = `Bearer ${newToken}`
}

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then((response) => response.data)
}

const createBlog = async (newBlog) => {
    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.post(baseUrl, newBlog, config)
    return response.data
}

const updateBlog = async (id, blogWithLikes) => {
    const response = await axios.put(`${baseUrl}/${id}`, blogWithLikes)
    return response.data
}

const deleteBlog = async (id) => {
    const config = {
        headers: { Authorization: token },
    }

    const request = await axios.delete(`${baseUrl}/${id}`, config)
    return request.data
}

export default { getAll, createBlog, setToken, updateBlog, deleteBlog }
