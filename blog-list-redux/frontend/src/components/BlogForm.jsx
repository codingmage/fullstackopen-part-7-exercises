import { Button, TextField } from "@mui/material"
import { useState } from "react"

const BlogForm = ({ createBlog }) => {
    const [blogName, setBlogName] = useState("")
    const [blogAuthor, setBlogAuthor] = useState("")
    const [blogURL, setBlogURL] = useState("")

    const addBlog = (event) => {
        event.preventDefault()

        const newBlog = {
            title: blogName,
            author: blogAuthor,
            url: blogURL,
        }
        createBlog(newBlog)
        setBlogName("")
        setBlogAuthor("")
        setBlogURL("")
    }

    return (
        <div>
            <h2>Add a new blog</h2>

            <form onSubmit={addBlog}>
                <div>
                    <TextField
                        id="blog-title"
                        /* type="text" */
                        /* name="Title" */
                        value={blogName}
                        onChange={({ target }) => setBlogName(target.value)}
                        size="small"
                        label="Title"
                        variant="standard"
                        margin="dense"
                    />
                </div>
                <div>
                    <TextField
                        id="blog-author"
                        /* type="text" */
                        /* name="Author" */
                        value={blogAuthor}
                        onChange={({ target }) => setBlogAuthor(target.value)}
                        size="small"
                        label="Author"
                        variant="standard"
                        margin="dense"
                    />
                </div>

                <div>
                    <TextField
                        id="blog-url"
                        /* type="text" */
                        /* name="URL" */
                        value={blogURL}
                        onChange={({ target }) => setBlogURL(target.value)}
                        size="small"
                        label="URL"
                        variant="standard"
                        margin="dense"
                    />
                </div>

                <Button
                    size="small"
                    variant="outlined"
                    id="submit-button"
                    type="submit"
                >
                    Add
                </Button>
            </form>
        </div>
    )
}

export default BlogForm
