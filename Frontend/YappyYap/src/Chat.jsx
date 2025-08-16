import { useEffect, useRef, useState } from "react"
import "./Chat.css"
import { gsap } from "gsap/gsap-core"
import axios from "../hooks/useAxios"
import default_image from "./assets/default_img.png"
export default function Chat(props) {
    const [msgs, setMsgs] = useState(Array());
    const [msg, setMsg] = useState("");
    const textArea = useRef();
    const ws = useRef(null);
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [strike, setStrike] = useState(false);
    const [optionsOpen, setOptionsOpen] = useState(false);
    const [yapDuration, setYapDuration] = useState(0);
    const [realm, setRealm] = useState("global-realm");
    const [navOpen, setNavopen] = useState(false);
    function optionsAnimation() {
        if (optionsOpen) {
            gsap.to(".chat-message-style-buttons", {
                x: -20,
                duration: 0.5,
                stagger: 0.1,
            })
            gsap.to(".chat-message-style-buttons", {
                display: "none",
                duration: 0.2,
            })
            gsap.to(".arrow-animationa", {
                rotate: "0deg",
                x: 0,
                duration: 0.6,
            })
            gsap.to(".arrow-animationb", {
                rotate: "0deg",
                display: "none",
                duration: 0.1,
                x: 0,
            })
        }
        else {
            gsap.to(".arrow-animationb", {
                delay: 0.4,
                rotate: "1080deg",
                display: "inline-block",
                duration: 0.1,
                x: 5,
            })
            gsap.to(".arrow-animationa", {
                rotate: "1440deg",
                x: 150,
                duration: 0.6,
            })
            gsap.to(".chat-message-style-buttons", {
                x: 20,
                duration: 0.5,
                stagger: 0.1,
            })
            gsap.to(".chat-message-style-buttons", {
                display: "inline",
                duration: 0.2,
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
            console.log("Fetching messages");
            const axios = useAxios

        }
        ws.current.onclose = () => {
            console.log("connection closed");
        }
        ws.current.onmessage = (e) => {
            try {
                const el = document.querySelector(".msgs");
                let text = e.data;
                let element = document.createElement("li");
                element.className = "chat-message-block"
                element.innerHTML = (`<img src=${default_image} alt="user" class="chat-message-img" /><span><span class="chat-message-header"><h3 class="username">Username</h3> <p class="timestamp">12:00am</p></span><p class="chat-message">${text}</p></span>`)
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
        console.log(`${ws.current} and ${ws.current.readyState}`)
        if (ws.current && ws.current.readyState == WebSocket.OPEN) {
            ws.current.send(msg);
        }
        textArea.current.value = "";
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
    function yapDurationhandler(e) {
        setYapDuration(e.target.value);
    }
    function handleActiveRealm(e) {
        const classname = `${e.target.textContent}-realm`;
        document.querySelector(`.${realm}`).style.color = "rgba(255, 255, 255, 0.277)";
        document.querySelector(`.${classname}`).style.color = "#10B981";
        setRealm(`${classname}`);
    }
    function navbarSimulator() {
        if (window.innerWidth <= 1100){
            const element = document.querySelector(".chat-area")
            if(navOpen){
                element.classList.add("nav-close-styles");
                element.classList.remove("nav-open-styles");
            }
            else{
                element.classList.add("nav-open-styles");
                element.classList.remove("nav-close-styles")
            }
            setNavopen((n)=>!n);
        }
    }
    return (
        <main className="chat-area nav-close-styles">
                <div className="chat-sidearea" onClick={navbarSimulator}>
                    <h2 className="chat-sidearea-heading">
                        <span className="realms-r-replacement">R</span>
                    <span className="ealms">ealms</span>
                    </h2>
                    <hr />
                    <ul className="realms-list">
                        <li><span className="dot-realm-style"></span><span className="channel-hashtag">#</span><button onClick={handleActiveRealm} className="realm-button global-realm">global</button></li>
                    </ul>
                    <div className="user-profile">
                        <img src={default_image} alt="user" className="user-profile-pic" />
                        <p>{props.username}</p>
                    </div>
                </div>
                <div className="chat-mainarea">
                    <div className="chat-header">
                    </div>
                    <div>
                        <ul className="msgs">
                            <li className="chat-message-block">
                                {/* <svg version="1.1" className="chat-message-img" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 32 32" enableBackground="0 0 32 32" xmlSpace="preserve"><path fill="#e8e5e5ff" d="M25.838 31H6.162a3.957 3.957 0 0 1-3.245-1.661 3.956 3.956 0 0 1-.549-3.604l.704-2.113a6.034 6.034 0 0 1 4.966-4.059C10.131 19.307 13.211 19 16 19c2.788 0 5.869.307 7.963.563a6.032 6.032 0 0 1 4.965 4.059l.704 2.113a3.954 3.954 0 0 1-.55 3.604A3.955 3.955 0 0 1 25.838 31zM16 21c-2.688 0-5.681.298-7.718.549a4.02 4.02 0 0 0-3.312 2.706l-.704 2.112c-.206.618-.106 1.274.274 1.802S5.511 29 6.162 29h19.676a1.98 1.98 0 0 0 1.622-.83c.381-.528.48-1.185.275-1.803l-.704-2.112a4.02 4.02 0 0 0-3.312-2.706C21.681 21.298 18.687 21 16 21zM16 18c-4.687 0-8.5-3.813-8.5-8.5S11.313 1 16 1c4.687 0 8.5 3.813 8.5 8.5S20.687 18 16 18zm0-15c-3.584 0-6.5 2.916-6.5 6.5S12.416 16 16 16s6.5-2.916 6.5-6.5S19.584 3 16 3z"/><path d="M12.04 10.54c-.543 0-.988-.435-1-.98a4.964 4.964 0 0 1 1.394-3.564 4.968 4.968 0 0 1 3.505-1.535c.562.01 1.009.428 1.02.98a1 1 0 0 1-.98 1.02 2.982 2.982 0 0 0-2.103.92 2.981 2.981 0 0 0-.836 2.139 1 1 0 0 1-.98 1.02h-.02z" fill="#008ad0"/></svg> */}
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
                            <span className="options-chat-message">
                                <button className="chat-show-options" onClick={optionsAnimation}>Options <span className="arrow-style arrow-animationa">{">"}</span></button>
                                <button className="chat-bold chat-message-style-buttons" onClick={boldHandler}>B</button>
                                <button className="chat-italic chat-message-style-buttons" onClick={italicHandler}>I</button>
                                <button className="chat-strike chat-message-style-buttons" onClick={strikeHandler}>S</button>
                                <button className="chat-show-options" onClick={optionsAnimation}><span className="arrow-style arrow-animationb">{"<"}</span></button>
                            </span>
                            <textarea placeholder="Enter message" ref={textArea} value={msg} onChange={changeHandler} className="send-message" />
                            <div className="chat-yap-duration">
                                <span>Duration: </span>
                                <input type="range" value={yapDuration} min={5} max={60 * 5} step={5} onChange={yapDurationhandler} />
                                <span id="chat-yap-duration">{`${yapDuration}s`}</span>
                            </div>
                            <button onClick={sendMsg} className="send-button">
                                <svg className="chat-sendsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 21L23 12L2 3L6 12L2 21Z" />
                                    <path d="M6 12L23 12" />
                                </svg></button>

                        </div>
                    </div>
                </div>
        </main>
    )
}