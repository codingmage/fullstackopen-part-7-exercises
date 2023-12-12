import { useState, useEffect, useRef } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import loginService from "./services/login"
import Notification from "./components/Notification"
import "./index.css"
import Togglable from "./components/Togglable"
import BlogForm from "./components/BlogForm"
import { useDispatch, useSelector } from "react-redux"
import { setNotification } from "./reducers/notificationReducer"
import { createBlog, initializeBlogs } from "./reducers/blogReducer"

const App = () => {
    /* const [blogs, setBlogs] = useState([]) */
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [user, setUser] = useState(null)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeBlogs())
        /* const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes) */
    }, [])

    const blogs = useSelector((state) => {
        const currentBlogs = state.blogs
        return currentBlogs
    })

    useEffect(() => {
        const userIsLoggedInJSON = window.localStorage.getItem("loggedInUser")
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
            blogService.setToken(user.token)
            setUser(user)
            setUsername("")
            setPassword("")
            dispatch(
                setNotification({
                    content: `logged in as ${user.username}`,
                    kind: "info",
                })
            )
            window.localStorage.setItem("loggedInUser", JSON.stringify(user))
        } catch (error) {
            console.log(error)
            dispatch(
                setNotification({
                    content: `unable to login. wrong username or password`,
                    kind: "error",
                })
            )
        }
    }

    const handleNewBlog = async (newBlog) => {
        try {
            dispatch(createBlog(newBlog, user))
            blogFormRef.current.toggleVisibility()
            dispatch(
                setNotification({
                    content: `new blog ${newBlog.title} added`,
                    kind: "info",
                })
            )
        } catch (error) {
            console.log(error)
            dispatch(
                setNotification({
                    content: `could not add blog. ${error.response.data.error}`,
                    kind: "error",
                })
            )
        }
    }

    const updateLikes = async (id, blog) => {
        try {
            await blogService.updateBlog(id, blog)
            dispatch(
                setNotification({
                    content: `liked blog ${blog.title}`,
                    kind: "info",
                })
            )
        } catch (error) {
            console.log(error)
            dispatch(
                setNotification({
                    content: `could not update likes. ${error.response.data.error}`,
                    kind: "error",
                })
            )
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
                dispatch(
                    setNotification({
                        content: `blog ${name} deleted`,
                        kind: "info",
                    })
                )
            } catch (error) {
                dispatch(
                    setNotification({
                        content: `could not delete blog. ${error.response.data.error}`,
                        kind: "error",
                    })
                )
            }
        }
    }

    const blogFormRef = useRef()

    if (user === null) {
        return (
            <div>
                <h2>Log in to application</h2>

                <Notification />

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

            <Notification />

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
            {blogs
                .toSorted((a, b) => b.likes - a.likes)
                .map((blog) => (
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
