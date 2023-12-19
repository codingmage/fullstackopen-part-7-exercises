import { useDispatch, useSelector } from "react-redux"
import { likeBlog, postComment } from "../reducers/blogReducer"
import { deleteBlog } from "../reducers/blogReducer"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const FullBlog = ({ blog }) => {
    const dispatch = useDispatch()

    const loggedInUser = useSelector(({ user }) => user)

    const navigate = useNavigate()

    const [comment, setComment] = useState("")

    if (!blog) {
        return null
    }

    const sameUser = loggedInUser.username === blog.user.username

    const handleDelete = async () => {
        if (confirm(`Delete ${blog.name} ?`) === true) {
            dispatch(deleteBlog(blog.id))
            navigate("/")
        }
    }

    const handleLiking = async () => {
        dispatch(likeBlog(blog.id, blog))
    }

    const handleComment = async (event) => {
        event.preventDefault()

        if (comment !== "") {
            dispatch(postComment(comment, blog.id))
        }
    }

    return (
        <div>
            <h2>
                {blog.title} - {blog.author}
            </h2>

            <div>{blog.url}</div>
            <div>
                {blog.likes} likes
                <button className="likeButton" onClick={handleLiking}>
                    like
                </button>
            </div>
            <div>added by {blog.user.name}</div>

            <ul>
                {blog.comments.map((comment) => (
                    <li key={comment.id}>{comment.text}</li>
                ))}
            </ul>

            <form onSubmit={handleComment}>
                <div>
                    <span>
                        new comment
                        <input
                            type="text"
                            value={comment}
                            onChange={({ target }) => setComment(target.value)}
                        />
                    </span>
                </div>
                <button type="submit">Add comment</button>
            </form>

            <div>
                {sameUser ? (
                    <button id="delete-button" onClick={handleDelete}>
                        remove
                    </button>
                ) : null}
            </div>
        </div>
    )
}

export default FullBlog
