import ReactDOM from "react-dom/client"
import App from "./App"
import { NotificationContextProvider } from "./NotificationContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { LoggedUserContextProvider } from "./UserContext"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
    <QueryClientProvider client={queryClient}>
        <NotificationContextProvider>
            <LoggedUserContextProvider>
                <App />
            </LoggedUserContextProvider>
        </NotificationContextProvider>
    </QueryClientProvider>
)
