import { useContext } from "react"
import NotificationContext from "../NotificationContext"

const Notification = () => {
    const [notification, dispatch] = useContext(NotificationContext)

    if (!notification) {
        return null
    } else if (notification.kind === "info") {
        return <div className="notification">{notification.content}</div>
    } else if (notification.kind === "error") {
        return <div className="errorMessage">{notification.content}</div>
    }
}

export default Notification
