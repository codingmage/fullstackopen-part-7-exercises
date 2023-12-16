import { useState } from "react"
import PropTypes from "prop-types"

const Blog = ({ blog, updateBlog, deleteBlog, currentUserName }) => {
    const [visible, setVisible] = useState(false)
    const [buttonContent, setButtonContent] = useState("view")
    /*     const [newLikes, setNewLikes] = useState(blog.likes) */

    const handleVisibility = () => {
        setVisible(!visible)
        if (buttonContent === "view") {
            setButtonContent("hide")
        } else {
            setButtonContent("view")
        }
    }

    const handleLiking = (event) => {
        event.preventDefault()

        const updatedBlog = { ...blog, likes: blog.likes + 1 }

        updateBlog(updatedBlog)

        /* setNewLikes(likesPlusOne) */
    }

    const handleDelete = (event) => {
        event.preventDefault()
        deleteBlog(blog.id, blog.title)
    }

    const showWhenVisible = { display: visible ? "" : "none" }

    const sameUser = currentUserName === blog.user.username

    return (
        <div className="blogStyle">
            <span id="main-info">
                {blog.title} - {blog.author}
                <button className="smallButton" onClick={handleVisibility}>
                    {buttonContent}
                </button>
            </span>
            <div style={showWhenVisible} id="extra-info">
                <div>{blog.url}</div>
                <div id="blogLikes">
                    {blog.likes}{" "}
                    <button className="likeButton" onClick={handleLiking}>
                        like
                    </button>
                </div>
                <div>{blog.user.name}</div>
                {sameUser ? (
                    <button id="delete-button" onClick={handleDelete}>
                        remove
                    </button>
                ) : (
                    ""
                )}
            </div>
        </div>
    )
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    updateBlog: PropTypes.func.isRequired,
    deleteBlog: PropTypes.func.isRequired,
    currentUserName: PropTypes.string.isRequired,
}

export default Blog
