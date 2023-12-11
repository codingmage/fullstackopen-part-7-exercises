import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import './index.css'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [notificationMessage, setNotificationMessage] = useState({
        type: '',
        text: '',
    })
    /* 	const [blogName, setBlogName] = useState("")
	const [blogAuthor, setBlogAuthor] = useState("")
	const [blogURL, setBlogURL] = useState("")
 */
    useEffect(() => {
        blogService.getAll().then((blogs) => {
            const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
            setBlogs(sortedBlogs)
        })
    }, [])

    useEffect(() => {
        const userIsLoggedInJSON = window.localStorage.getItem('loggedInUser')
        if (userIsLoggedInJSON) {
            const user = JSON.parse(userIsLoggedInJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const userLogOut = () => {
        /* window.localStorage.removeItem('loggedInUser') */
        window.localStorage.clear()
        setUser(null)
        window.location.reload()
    }

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username,
                password,
            })
            /*       console.log(user) */
            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
            window.localStorage.setItem('loggedInUser', JSON.stringify(user))
        } catch (error) {
            console.log(error)
            setNotificationMessage({
                ...notificationMessage,
                type: 'error',
                text: 'wrong username or password',
            })
            setTimeout(() => {
                setNotificationMessage('')
            }, 5000)
        }
    }

    const handleNewBlog = async (newBlog) => {
        /* 		event.preventDefault()

		const newBlog = {
			title: blogName,
			author: blogAuthor,
			url: blogURL
		} */
        try {
            const responseBlog = await blogService.createBlog(newBlog)
            console.log(responseBlog)
            setBlogs([...blogs, { ...responseBlog, user: user }])
            blogFormRef.current.toggleVisibility()
            /* 			setBlogName("")
			setBlogAuthor("")
			setBlogURL("") */
            setNotificationMessage({
                ...notificationMessage,
                type: 'info',
                text: `new blog ${responseBlog.title} added`,
            })
            setTimeout(() => {
                setNotificationMessage('')
            }, 5000)
        } catch (error) {
            console.log(error)
            setNotificationMessage({
                ...notificationMessage,
                type: 'error',
                text: `could not add blog. ${error.response.data.error}`,
            })
            setTimeout(() => {
                setNotificationMessage('')
            }, 5000)
        }
    }

    const updateLikes = async (id, blog) => {
        try {
            await blogService.updateBlog(id, blog)
        } catch (error) {
            console.log(error)
            setNotificationMessage({
                ...notificationMessage,
                type: 'error',
                text: `could not update likes. ${error.response.data.error}`,
            })
            setTimeout(() => {
                setNotificationMessage('')
            }, 5000)
        }
    }

    const deleteThisBlog = async (id, name) => {
        if (confirm(`Delete ${name} ?`) === true) {
            try {
                await blogService.deleteBlog(id)
                const blogsWithoutDeleted = blogs.filter(
                    (blog) => blog.id !== id
                )
                setBlogs(blogsWithoutDeleted)
                setNotificationMessage({
                    ...notificationMessage,
                    type: 'info',
                    text: 'blog ${name} deleted',
                })
            } catch (error) {
                setNotificationMessage({
                    ...notificationMessage,
                    type: 'error',
                    text: `could not delete blog. ${error.response.data.error}`,
                })
                setTimeout(() => {
                    setNotificationMessage('')
                }, 5000)
            }
        }
    }

    /* 	const sortedBlogs = blogs.sort((a, b) => a.likes - b.likes)
	const mostLikesFirst = sortedBlogs.reverse() */

    const blogFormRef = useRef()

    if (user === null) {
        return (
            <div>
                <h2>Log in to application</h2>

                <Notification
                    message={notificationMessage.text}
                    type={notificationMessage.type}
                />

                <form onSubmit={handleLogin}>
                    <div>
                        <span>
                            username
                            <input
                                type="text"
                                value={username}
                                name="Username"
                                id="input-username"
                                onChange={({ target }) =>
                                    setUsername(target.value)
                                }
                            />
                        </span>
                    </div>
                    <div>
                        <span>
                            password
                            <input
                                type="password"
                                value={password}
                                name="Password"
                                id="input-password"
                                onChange={({ target }) =>
                                    setPassword(target.value)
                                }
                            />
                        </span>
                    </div>
                    <button id="login-button" type="submit">
                        login
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div>
            <h2>blogs</h2>

            <Notification
                message={notificationMessage.text}
                type={notificationMessage.type}
            />

            <div>
                {user.name} is logged in
                <button id="logout-button" type="button" onClick={userLogOut}>
                    logout
                </button>
            </div>
            <br />
            <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                <BlogForm createBlog={handleNewBlog} />
            </Togglable>

            <br />
            {blogs.map((blog) => (
                <Blog
                    key={blog.id}
                    blog={blog}
                    updateBlog={updateLikes}
                    deleteBlog={deleteThisBlog}
                    currentUserName={user.username}
                />
            ))}
        </div>
    )
}

export default App
