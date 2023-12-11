import { useSelector } from 'react-redux'

const Notification = () => {
    const notificationInStore = useSelector((state) => state.notification)

    if (notificationInStore.kind === '') {
        return null
    } else if (notificationInStore.kind === 'info') {
        return <div className="notification">{notificationInStore.content}</div>
    } else if (notificationInStore.kind === 'error') {
        return <div className="errorMessage">{notificationInStore.content}</div>
    }
}

export default Notification
