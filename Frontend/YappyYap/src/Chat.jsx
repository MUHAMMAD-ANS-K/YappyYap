import { useEffect, useRef, useState } from "react"
import "./Chat.css"
import ChatSideBar from "./Chat-Modules/ChatSideBar"
import ChatHeader from "./Chat-Modules/ChatHeader"
import useChatAuth from "../hooks/useChatAuth"
import Global from "./Global"
import Voice from "./Voice"
export default function Chat() {
    const {username} = useChatAuth();
    const [realm, setRealm] = useState("global-realm");
    return(
        <main className="chat-area nav-close-styles">
                <ChatSideBar username = {username} realm={realm} setRealm={setRealm}/>
                <div className="chat-mainarea">
                    <ChatHeader realm={realm}/>
                    {realm === "global-realm" ? <Global/> : <Voice/>}
                </div>
        </main>
    )
}