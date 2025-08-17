import "./ChatHeader.css"
import useAxios from "../../hooks/useAxios"
import { useState } from "react"
export default function ChatHeader(props) {
    const [online, setOnline] = useState(0)
    
    const axios = useAxios()
    async function getOnline() {
        try{
            const response = await axios.get("/livecount");
            if (response.data.msg === "Success") {
                setOnline(response.data.total)
            }
        }
        catch {}
    }
    setInterval(getOnline, 5000);
    return(
            <div className="chat-header">
                <div className="active-realm">

                    <h2>{(props.realm).toUpperCase()}
                        </h2>
                </div>
                        <div className="online-count">
                                <div className="online-count-dot">
                                </div>
                                <span>{online}</span>
                        </div>
            </div>
    )
}