import React from "react"
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import Blog from "./Blog"
import userEvent from "@testing-library/user-event"
import BlogForm from "./BlogForm"

test("BlogForm form and event handler work correctly", async () => {

	const mockHandler = jest.fn()
	const user = userEvent.setup()

	const { container } = render(<BlogForm createBlog={mockHandler} />)

	const title = container.querySelector("#blog-title")
	const author = container.querySelector("#blog-author")
	const url = container.querySelector("#blog-url")

	const submit = screen.getByRole("button")

	await user.type(title, "Title for the test")
	await user.type(author, "Author for the test")
	await user.type(url, "urlforthetest.com")

	await user.click(submit)

	expect(mockHandler.mock.calls).toHaveLength(1)
	expect(mockHandler.mock.calls[0][0].title).toBe("Title for the test")
	expect(mockHandler.mock.calls[0][0].author).toBe("Author for the test")
	expect(mockHandler.mock.calls[0][0].url).toBe("urlforthetest.com")

})
