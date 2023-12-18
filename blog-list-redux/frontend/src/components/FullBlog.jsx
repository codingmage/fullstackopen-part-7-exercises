import { useDispatch, useSelector } from "react-redux"
import { likeBlog } from "../reducers/blogReducer"
import { deleteBlog } from "../reducers/blogReducer"
import { useNavigate } from "react-router-dom"

const FullBlog = ({ blog }) => {
    const dispatch = useDispatch()

    const loggedInUser = useSelector(({ user }) => user)

    const navigate = useNavigate()

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
