import { useEffect, useRef, useState } from "react"
import "./Chat.css"
import {gsap} from "gsap/gsap-core"
import {useGSAP} from "@gsap/react"
import default_image from "./assets/default_img.png"
export default function Chat() {
    const [msgs, setMsgs] = useState(Array());
    const [msg, setMsg] = useState("");
    const textArea = useRef();
    const ws = useRef(null);
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [strike, setStrike] = useState(false);
    const [optionsOpen, setOptionsOpen] = useState(false);
        function optionsAnimation() {
            if (optionsOpen) {
                gsap.to(".chat-message-style-buttons", {
                    x : -20,
                    duration: 1,
                    stagger : 0.1,
                    yoyo: true,
                })
                gsap.to(".chat-message-style-buttons", {
                    opacity: 1,
                    duration: 1,
                })
            }
            else{
                gsap.from(".chat-message-style-buttons", {
                    x : 20,
                    duration: 1,
                    stagger: 0.1,
                    yoyo : true
                })
                gsap.to(".chat-message-style-buttons", {
                    opacity: 1,
                })
            }
            setOptionsOpen((o) => !o);
        }
    useEffect(() => {
        textArea.current.style.height = "auto";
        if (textArea.current.scrollHeight < 400) {
            textArea.current.style.height = textArea.current.scrollHeight + "px";
        }
        else {
            textArea.current.style.height = "400px";
        }
    }, [msg])
    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8000/ws");
        ws.current.onopen = () => {
            console.log("connection opened");
        }
        ws.current.onclose = () => {
            console.log("connection closed");
        }
        ws.current.onmessage = (e) => {
            try {
                const el = document.querySelector(".msgs");
                let text = e.data;
                let element = document.createElement("li");
                element.innerHTML = text;
                el.append(element);
            }
            catch {
                console.log("Error occured in the message");
            }
        }
        ws.current.onerror = () => {
            if (ws.current.OPEN) {
                ws.current.close();
            }
            console.log("An errro occured");
        }
    }, [])
    function sendMsg() {
        if (ws.current && ws.current.readyState == WebSocket.OPEN) {
            ws.current.send(msg);
        }
        msg.current.value = "";
    }
    function boldHandler(e) {
        if (!bold) {
            e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
        }
        else {
            e.target.style.backgroundColor = "transparent";
        }
        setBold((b) => !b);
    }
    function italicHandler(e) {
        if (!italic) {
            e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
        }
        else {
            e.target.style.backgroundColor = "transparent";
        }
        setItalic((b) => !b);
    }
    function strikeHandler(e) {
        if (!strike) {
            e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
        }
        else {
            e.target.style.backgroundColor = "transparent";
        }
        setStrike((b) => !b);
    }
    function changeHandler(e) {
        // console.log(e.nativeEvent.data)
        // if(bold) {
        //     setMsg((m)=> m +`<i>${e.nativeEvent.data}</i>`)
        // }
        // else{
        setMsg(e.target.value);
        // }
    }
    return (
        <main>

            <div className="chat">
                <div className="chat-sidearea">

                </div>
                <div className="chat-mainarea">
                    <div className="chat-header">
                    </div>
                    <div>
                        <ul className="msgs">
                            <li className="chat-message-block">
                                <img src={default_image} alt="user" className="chat-message-img" />
                                <span>
                            <span className="chat-message-header"><h3 className="username">Username</h3> <p className="timestamp">12:00am</p></span>
                                    <p className="chat-message">facilis quia assumenda autem officia necessitatibus cupiditate. Consequatur provident consequuntur quod quaerat quos repellat sapiente.</p>
                                </span>
                            </li>
                            <li className="chat-message-block">
                                <img src={default_image} alt="user" className="chat-message-img" />
                                <span>
                            <span className="chat-message-header"><h3 className="username">Username</h3> <p className="timestamp">12:00am</p></span>
                                    <p className="chat-message">facilis quia assumenda autem officia necessitatibus cupiditate. Consequatur provident consequuntur quod quaerat quos repellat sapiente.</p>
                                </span>
                            </li>
                            <li className="chat-message-block">
                                <img src={default_image} alt="user" className="chat-message-img" />
                                <span>
                            <span className="chat-message-header"><h3 className="username">Username</h3> <p className="timestamp">12:00am</p></span>
                                    <p className="chat-message">facilis quia assumenda autem officia necessitatibus cupiditate. Consequatur provident consequuntur quod quaerat quos repellat sapiente.</p>
                                </span>
                            </li>
                            <li className="chat-message-block">
                                <img src={default_image} alt="user" className="chat-message-img" />
                                <span>
                            <span className="chat-message-header"><h3 className="username">Username</h3> <p className="timestamp">12:00am</p></span>
                                    <p className="chat-message">facilis quia assumenda autem officia necessitatibus cupiditate. Consequatur provident consequuntur quod quaerat quos repellat sapiente.</p>
                                </span>
                            </li>
                            <li className="chat-message-block">
                                <img src={default_image} alt="user" className="chat-message-img" />
                                <span>
                            <span className="chat-message-header"><h3 className="username">Username</h3> <p className="timestamp">12:00am</p></span>
                                    <p className="chat-message">facilis quia assumenda autem officia necessitatibus cupiditate. Consequatur provident consequuntur quod quaerat quos repellat sapiente.</p>
                                </span>
                            </li>
                            <li className="chat-message-block">
                                <img src={default_image} alt="user" className="chat-message-img" />
                                <span>
                            <span className="chat-message-header"><h3 className="username">Username</h3> <p className="timestamp">12:00am</p></span>
                                    <p className="chat-message">Hi Chat</p>
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className="message-area-overlay">
                        <div className="message-area">
                            <span className="options-chat-message"><button className="chat-show-options" onClick={optionsAnimation}>Options <span className="arrow">{">"}</span></button>
                            <button className="chat-bold chat-message-style-buttons" onClick={boldHandler}>B</button>
                            <button className="chat-italic chat-message-style-buttons" onClick={italicHandler}>I</button>
                            <button className="chat-strike chat-message-style-buttons" onClick={strikeHandler}>S</button></span>
                            <textarea placeholder="Enter message" ref={textArea} value={msg} onChange={changeHandler} className="send-message" />
                            <button onClick={sendMsg} className="send-button">
                                <svg className="chat-sendsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 21L23 12L2 3L6 12L2 21Z" />
                                    <path d="M6 12L23 12" />
                                </svg></button>

                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}