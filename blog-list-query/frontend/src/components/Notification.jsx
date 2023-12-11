const Notification = ({ message, type }) => {
	if (type === "") {

		return null

	} else if (type === "info") {

		return (
			<div className="notification">
				{message}
			</div>
		)

	} else if (type === "error") {

		return (
			<div className="errorMessage">
				{message}
			</div>
		)
	}
  
}

export default Notification