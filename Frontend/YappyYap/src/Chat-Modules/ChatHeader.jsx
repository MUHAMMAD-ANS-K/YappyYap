import "./ChatHeader.css"
import useAxios from "../../hooks/useAxios"
import { useEffect, useState, useCallback } from "react"
export default function ChatHeader(props) {
    const [online, setOnline] = useState(0);
    const [navOpen, setNavopen] = useState(false)
    const axios = useAxios()
    const getOnline = useCallback(async ()=> {
        try{
            let initialPath = "global";
            if (props.realm == "voice-realm") {
                initialPath = "voice";
            }
            const response = await axios.get(`${initialPath}/livecount`);
            if (response.data.msg === "Success") {
                setOnline(response.data.total)
            }
        }
        catch {}
    })
    useEffect(()=>{
        let theme = localStorage.getItem("theme");
        if(theme)
            document.documentElement.setAttribute("data-theme", theme);
        const onlineInterval = setInterval(getOnline, 5000);
        return ()=> clearInterval(onlineInterval);
    }, [])
    function changeTheme(e) {
        let temp = e.target.value;
        localStorage.setItem("theme", temp);
        document.documentElement.setAttribute("data-theme", temp);
        props.setTheme(pre => temp);
    }
    function navBarSimulator(){
        const element = document.querySelector(".chat-area");
        // if (props.navOpen){
        //     element.classList.add("nav-close-styles");
        //     element.classList.remove("nav-open-styles");
        // }
        element.classList.remove("nav-close-styles");
        element.classList.add("nav-open-styles");
        props.setNavopen(n => true);
    }
    return(
            <div className="chat-header">
                <div className="chat-menu-bar" onClick={navBarSimulator}>≡</div>
                <div className="active-realm">

                    <h2>{(props.realm).toUpperCase()}
                        </h2>
                </div>
                <div className="chat-theme">
                <select className="select-theme-design" value = {props.theme} onChange={changeTheme}>
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