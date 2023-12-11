const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
/* const User = require("../models/user") */

// use express-async-errors instead of try/catch

blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({}).populate("user", { username: 1, name: 1, id: 1 })
	response.json(blogs)
})

blogsRouter.post("/", async (request, response) => {

	const body = request.body

	/*     const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id) */

	const user = request.user

	const noLikes = !body.likes

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: noLikes ? 0 : body.likes,
		user: user.id
	})

	const savedBlog = await blog.save()
	user.blogs = [...user.blogs, blog]
	await user.save()
	await response.status(201).json(savedBlog)

	/* Try and catch alternative:
    try {
      const savedBlog = await blog.save()
      response.status(201).json(savedBlog)
    } catch (error) {
        next(error)
    }
     */
})

blogsRouter.delete("/:id", async (request, response) => {

	/*   const verifiedToken = jwt.verify(request.token, process.env.SECRET)

  if (!verifiedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }   */

	const user = request.user

	const thisBlog = await Blog.findById(request.params.id)

	if (user.id.toString() === thisBlog.user.toString()) {
		await Blog.findByIdAndRemove(request.params.id)
		response.status(204).end()
	} else {
		response.status(401).json({ error: "user does not match" })
	}

	/* await Blog.findByIdAndRemove(request.params.id) */
	/* response.status(204).end() */
})

blogsRouter.put("/:id", async (request, response) => {
	// as per the answer:
	const { title, author, url, likes } = request.body

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { title, author, url, likes }, { new: true })

	response.json(updatedBlog)
/* 	old answer, buggy if called before reloading page
	const body = request.body

	const user = await User.findById(body.user)

	const updatedBlog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		user: user.id
	}

	await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
	response.status(200).end() */
})

module.exports = blogsRouter