import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [blogName, setBlogName] = useState('')
    const [blogAuthor, setBlogAuthor] = useState('')
    const [blogURL, setBlogURL] = useState('')

    const addBlog = (event) => {
        event.preventDefault()

        const newBlog = {
            title: blogName,
            author: blogAuthor,
            url: blogURL,
        }
        createBlog(newBlog)
        setBlogName('')
        setBlogAuthor('')
        setBlogURL('')
    }

    return (
        <div>
            <h2>Add a new blog</h2>

            <form onSubmit={addBlog}>
                <p>
                    title:{' '}
                    <input
                        id="blog-title"
                        type="text"
                        name="Title"
                        value={blogName}
                        onChange={({ target }) => setBlogName(target.value)}
                    />
                </p>
                <p>
                    author:{' '}
                    <input
                        id="blog-author"
                        type="text"
                        name="Author"
                        value={blogAuthor}
                        onChange={({ target }) => setBlogAuthor(target.value)}
                    />
                </p>
                <p>
                    url:{' '}
                    <input
                        id="blog-url"
                        type="text"
                        name="URL"
                        value={blogURL}
                        onChange={({ target }) => setBlogURL(target.value)}
                    />
                </p>
                <button id="submit-button" type="submit">
                    Add
                </button>
            </form>
        </div>
    )
}

export default BlogForm
