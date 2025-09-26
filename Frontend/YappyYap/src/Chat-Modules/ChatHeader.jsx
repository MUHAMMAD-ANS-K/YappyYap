import "./ChatHeader.css"
import useAxios from "../../hooks/useAxios"
import { useEffect, useState } from "react"
export default function ChatHeader(props) {
    const [online, setOnline] = useState(0)
    const [theme, setTheme] = useState("green");
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
    useEffect(()=>{
        const onlineInterval = setInterval(getOnline, 5000);
        return ()=> clearInterval(onlineInterval);
    }, [])
    function changeTheme(e) {
        document.documentElement.setAttribute("data-theme", e.target.value);
    }
    return(
            <div className="chat-header">
                <div className="active-realm">

                    <h2>{(props.realm).toUpperCase()}
                        </h2>
                </div>
                <div className="chat-theme">
                <select onChange={changeTheme}>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="beige">Beige</option>
                </select>
                {/* <div className="setting">
                    <input type="color"/>
                </div> */}
                </div>
                        <div className="online-count">
                                <div className="online-count-dot">
                                </div>
                                <span>{online}</span>
                        </div>
            </div>
    )
}