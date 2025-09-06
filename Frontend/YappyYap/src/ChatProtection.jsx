import { Navigate } from "react-router-dom";
import useChatAuth from "../hooks/useChatAuth";

export default function ChatProtection({children}) {
    const {logged, loading} = useChatAuth();
    if (false) {
        return (
            <div className="loading">
                Loading...
            </div>
        )
    }
    else{
        if (true) {
            return(
                <>
                {children}
                </>
            )
        }
        else{
            return <Navigate to="/signup" replace/>
        }
    }
}