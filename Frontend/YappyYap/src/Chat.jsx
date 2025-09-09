import { useEffect, useRef, useState } from "react"
import "./Chat.css"
import { Routes, Route, Navigate } from "react-router-dom"
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
                    <Routes>
                        <Route path="/" element={<DefaultRoot/>}/>
                        <Route path="/global" element={<Global/>}/>
                        <Route path="/voice" element={<Voice/>}/>
                    </Routes>
                    {/* {realm === "global-realm" ? <Global/> : <Voice/>} */}
                </div>
        </main>
    )
}
function DefaultRoot() {
    return(
        <Navigate to="/chat/global" replace/>
    )
}