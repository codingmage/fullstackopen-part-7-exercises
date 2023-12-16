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
import {
    createBlog,
    deleteBlog,
    initializeBlogs,
    likeBlog,
} from "./reducers/blogReducer"
import {
    logOutCurrentUser,
    rememberUser,
    userLogIn,
} from "./reducers/userReducer"

const App = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    /* const [blogs, setBlogs] = useState([]) */
    /* const [user, setUser] = useState(null) */

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeBlogs())
        /* const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes) */
    }, [])

    useEffect(() => {
        dispatch(rememberUser())
        /* const userIsLoggedInJSON = window.localStorage.getItem("loggedInUser")
        if (userIsLoggedInJSON) {
            const user = JSON.parse(userIsLoggedInJSON)
            dispatch(userLogIn(user))
        } */
    }, [])

    const blogs = useSelector((state) => {
        const currentBlogs = state.blogs
        return currentBlogs
    })

    const loggedInUser = useSelector(({ user }) => user)

    const userLogOut = () => {
        dispatch(logOutCurrentUser())
        /* window.localStorage.removeItem('loggedInUser') */
        /* window.localStorage.clear()
        setUser(null)
        window.location.reload() */
    }

    const handleLogin = async (event) => {
        event.preventDefault()
        dispatch(userLogIn(username, password))
        dispatch(
            setNotification({
                content: `logged in as ${username}`,
                kind: "info",
            })
        )
        setUsername("")
        setPassword("")
    }

    const handleNewBlog = async (newBlog) => {
        dispatch(createBlog(newBlog, loggedInUser))
        blogFormRef.current.toggleVisibility()
        dispatch(
            setNotification({
                content: `new blog ${newBlog.title} added`,
                kind: "info",
            })
        )
    }

    const updateLikes = async (id, blog) => {
        dispatch(likeBlog(id, blog))
        dispatch(
            setNotification({
                content: `liked blog ${blog.title}`,
                kind: "info",
            })
        )
    }

    const deleteThisBlog = async (id, name) => {
        if (confirm(`Delete ${name} ?`) === true) {
            dispatch(deleteBlog(id))
            dispatch(
                setNotification({
                    content: `blog ${name} deleted`,
                    kind: "info",
                })
            )
        }
    }

    const blogFormRef = useRef()

    if (loggedInUser === null) {
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
                {loggedInUser.name} is logged in
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
                        currentUserName={loggedInUser.username}
                    />
                ))}
        </div>
    )
}

export default App
