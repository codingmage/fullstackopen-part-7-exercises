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
import { AppBar, Button, TextField, Toolbar } from "@mui/material"

const Main = ({ blogs }) => {
    const dispatch = useDispatch()

    const loggedInUser = useSelector(({ user }) => user)

    const blogFormRef = useRef()

    const handleNewBlog = async (newBlog) => {
        dispatch(createBlog(newBlog, loggedInUser))
        blogFormRef.current.toggleVisibility()
    }

    return (
        <div>
            <Togglable /* buttonLabel="create new blog" */ ref={blogFormRef}>
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

        if (username === "" || password === "") {
            dispatch(
                setNotification({
                    content: `please provide a name and a password`,
                    kind: "error",
                })
            )
        } else {
            dispatch(userLogIn(username, password))
            setUsername("")
            setPassword("")
        }
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
            <div id="login-container">
                <Notification />

                <form id="login-style" onSubmit={handleLogin}>
                    <h2>Login to access the app</h2>
                    <div>
                        <span>
                            <TextField
                                /* type="text" */
                                // name="Username"
                                label="username"
                                id="input-username"
                                value={username}
                                onChange={({ target }) =>
                                    setUsername(target.value)
                                }
                                size="small"
                                margin="dense"
                                /* required */
                            />
                        </span>
                    </div>
                    <div>
                        <span>
                            <TextField
                                type="password"
                                value={password}
                                // name="Password"
                                id="input-password"
                                onChange={({ target }) =>
                                    setPassword(target.value)
                                }
                                label="password"
                                size="small"
                                margin="dense"
                                /* required */
                            />
                        </span>
                    </div>
                    <Button
                        variant="contained"
                        id="login-button"
                        type="submit"
                        size="small"
                    >
                        login
                    </Button>
                </form>
            </div>
        )
    }

    return (
        <div id="home-style">
            <AppBar position="static">
                <Toolbar
                    variant="dense"
                    style={{ justifyContent: "space-between" }}
                >
                    <div id="nav-buttons-container">
                        <Button color="inherit" variant="outlined">
                            <Link to={"/"}>Home</Link>
                        </Button>
                        <Button color="inherit" variant="outlined">
                            <Link to={"/users"}>Users</Link>
                        </Button>
                    </div>
                    <div>
                        <span>{loggedInUser.name} is logged in</span>
                        <Button
                            id="logout-button"
                            /*                             type="button" */
                            color="inherit"
                            size="small"
                            variant="outlined"
                            onClick={userLogOut}
                        >
                            logout
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>

            <h1>blog app</h1>

            <Notification />

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
