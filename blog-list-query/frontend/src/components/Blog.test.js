import React from "react"
import "@testing-library/jest-dom"
import { render } from "@testing-library/react"
import Blog from "./Blog"
import userEvent from "@testing-library/user-event"


describe("Blog component", () => {

	let container

	const mockHandlerUp = jest.fn()
	
	const mockHandlerDel = jest.fn()

	beforeEach(() => {
		const blog = {
			title: "test number 1",
			author: "me",
			url: "righthere.com",
			likes: 0,
			user: {
				username: "Faker"
			}
		}
	
		container = render(<Blog blog={blog} updateBlog={mockHandlerUp} deleteBlog={mockHandlerDel} currentUserName="Faker" />).container
	})

	test("renders only main blog content", () => {
		const span = container.querySelector("#main-info")
		expect(span).toHaveTextContent("test number 1")
		expect(span).toHaveTextContent("me")
	
		const div = container.querySelector("#extra-info")
		expect(div).toHaveStyle("display: none")
	})

	test("renders extra blog content after button click", async () => {
		const user = userEvent.setup()  
		const button = container.querySelector(".smallButton")
		await user.click(button)

		const div = container.querySelector("#extra-info")
		expect(div).not.toHaveStyle("display: none")
		expect(div).toHaveTextContent("righthere.com")
		expect(div).toHaveTextContent(0)
	})

	test("'s like function is called twice if pressed twice", async () => {
		const user = userEvent.setup()
		const like = container.querySelector(".likeButton")
		await user.click(like)
		await user.click(like)

		expect(mockHandlerUp.mock.calls).toHaveLength(2)
	})

})

