describe("Blog app", function() {
	beforeEach(function() {
		cy.request("POST", "http://localhost:3003/api/testing/reset")
		const user = {
			name: "Test User",
			username: "testusername",
			password: "testpassword"
		}
		cy.request("POST", "http://localhost:3003/api/users/", user)
		const secondUser = {
			name: "Second Me",
			username: "second",
			password: "password"
		}
		cy.request("POST", "http://localhost:3003/api/users/", secondUser)
		cy.visit("http://localhost:5173")
	})
  
	it("Login form is shown", function() {
		cy.contains("login")
	})

	describe("Login", function() {
		it("succeeds with correct credentials", function() {
			cy.contains("login")
			cy.get("#input-username").type("testusername")
			cy.get("#input-password").type("testpassword")
			cy.get("#login-button").click()

			cy.contains("Test User is logged in")

		})
	
		it("fails with wrong credentials", function() {
			cy.contains("login")
			cy.get("#input-username").type("wrongusername")
			cy.get("#input-password").type("wrongpassword")
			cy.get("#login-button").click()

			cy.contains("wrong username or password")
			cy.get(".errorMessage").should("have.css", "color", "rgb(255, 0, 0)")
		})
	})

	describe("When logged in", function() {
		beforeEach(function () {
			cy.request("POST", "http://localhost:3003/api/login", {
				username: "testusername", password: "testpassword"
			}).then(response => {
				localStorage.setItem("loggedInUser", JSON.stringify(response.body))
				cy.visit("http://localhost:5173")
			})
		})

		it("a new blog can be added", function() {
			cy.contains("create new blog").click()
			cy.get("#blog-title").type("blog title")
			cy.get("#blog-author").type("blog author")
			cy.get("#blog-url").type("blog url")
			cy.get("#submit-button").click()

			cy.contains("blog title")
			cy.contains("blog title - blog author")
		})

		describe("and blogs exist", function() {
			beforeEach(function () {
				cy.contains("create new blog").click()
				cy.get("#blog-title").type("blog title")
				cy.get("#blog-author").type("blog author")
				cy.get("#blog-url").type("blog url")
				cy.get("#submit-button").click()
				
				cy.contains("create new blog").click()
				cy.get("#blog-title").type("second title")
				cy.get("#blog-author").type("second author")
				cy.get("#blog-url").type("second url")
				cy.get("#submit-button").click()
			})


			it("a user can like a blog", function() {
				cy.contains("blog title - blog author").contains("view").click()
				cy.contains("blog title - blog author").contains("hide")

				cy.contains("blog title - blog author").parent().find(".likeButton").click()
				cy.contains("blog title - blog author").parent().find("#blogLikes").should("contain", "1")
			})

			it("the user who created the blog can delete it", function() {
				cy.contains("blog title - blog author").contains("view").click()
				cy.contains("blog title - blog author").contains("hide")

				cy.contains("blog title - blog author").parent().find("#delete-button").click()
				cy.contains("blog title - blog author").should("not.exist")
			})

			it("the user who didn't create it can't delete it", function() {
				cy.get("#logout-button").click()

				cy.request("POST", "http://localhost:3003/api/login", {
					username: "second", password: "password"
				}).then(response => {
					localStorage.setItem("loggedInUser", JSON.stringify(response.body))
					cy.visit("http://localhost:5173")
				})

				cy.contains("blog title - blog author").contains("view").click()
				cy.contains("blog title - blog author").parent().find("#delete-button").should("not.exist")

			})

			it("the blogs are sorted by likes", function() {
				cy.contains("blog title - blog author").contains("view").click()
				cy.contains("blog title - blog author").parent().find(".likeButton").click()

				cy.contains("second title").contains("view").click()
				cy.contains("second title").parent().find(".likeButton").click()
				cy.wait(400)
				cy.contains("second title").parent().find(".likeButton").click()

				cy.reload()

				cy.get(".blogStyle").eq(0).should("contain", "second title")
				cy.get(".blogStyle").eq(1).should("contain", "blog title - blog author")


			})
		})
	})
})