import { useState, useEffect, useRef } from "react"
import Blog from "./components/Blog"
/* import blogService from "./services/blogs"
import loginService from "./services/login" */
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
import { Link, Route, Routes, useMatch } from "react-router-dom"
import userService from "./services/users"
import UsersComponent from "./components/UsersComponent"
import FullBlog from "./components/FullBlog"

const Main = ({ blogs }) => {
    const dispatch = useDispatch()

    const loggedInUser = useSelector(({ user }) => user)

    const blogFormRef = useRef()

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

    /*     const updateLikes = async (id, blog) => {
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
    } */

    return (
        <div>
            <Link to={"/users"}>Users</Link>

            <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                <BlogForm createBlog={handleNewBlog} />
            </Togglable>

            <br />
            {blogs
                .toSorted((a, b) => b.likes - a.likes)
                .map((blog) => (
                    <Link to={`/blogs/${blog.id}`} key={blog.id}>
                        <div className="blogStyle">
                            <span id="main-info">
                                {blog.title} - {blog.author}
                            </span>
                        </div>
                        {/*                         <Blog
                            blog={blog}
                            updateBlog={updateLikes}
                            deleteBlog={deleteThisBlog}
                            currentUserName={loggedInUser.username}
                        /> */}
                    </Link>
                ))}
        </div>
    )
}

const FullUser = ({ user }) => {
    if (!user) {
        return null
    }

    return (
        <div>
            <h2>{user.name}</h2>

            <h4>added blogs</h4>

            <ul>
                {user.blogs.map((blog) => (
                    <li key={blog.id}>{blog.title}</li>
                ))}
            </ul>
        </div>
    )
}

const App = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [users, setUsers] = useState([])

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeBlogs())
    }, [])

    useEffect(() => {
        dispatch(rememberUser())
    }, [])

    useEffect(() => {
        userService.getAllUsers().then((users) => {
            setUsers(users)
        })
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

    const singleUserMatch = useMatch("/users/:id")

    const thisUser = singleUserMatch
        ? users.find((user) => user.id === singleUserMatch.params.id)
        : null

    const singleBlogMatch = useMatch("/blogs/:id")

    const thisBlog = singleBlogMatch
        ? blogs.find((blog) => blog.id === singleBlogMatch.params.id)
        : null

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

            <Routes>
                <Route path="/" element={<Main blogs={blogs} />} />
                <Route
                    path="/blogs/:id"
                    element={<FullBlog blog={thisBlog} />}
                />
                <Route
                    path="/users"
                    element={<UsersComponent users={users} />}
                />
                <Route
                    path="/users/:id"
                    element={<FullUser user={thisUser} />}
                />
            </Routes>
        </div>
    )
}

export default App
