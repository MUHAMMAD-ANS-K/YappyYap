import { useEffect, useRef, useState } from "react"
import "./Chat.css"
import { gsap } from "gsap/gsap-core"
// import {useAxios} from "../hooks/useAxios"
import default_image from "./assets/default_img.png"
import useAxios from "../hooks/useAxios"
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
        const axios = useAxios()
        async function getMessages () {
            try{
            const messages = await axios.get("/getchatmsgs")
            if (messages.data.msg == "Success") {
                const response = messages.data.msgs;
                const parent_element = document.querySelector(".msgs");
                response.forEach(element => {
                    let text = element.msg;
                    let username = element.username;
                    let time = new Date(element.time_sent);
                    let expiry = new Date(element.expiry);
                    time = time.toLocaleTimeString([], {hour : "2-digit", minute : "2-digit"})
                    let new_element = document.createElement("li");
                    new_element.className = "chat-message-block";
                    new_element.id = expiry;
                    new_element.innerHTML = (`<img src=${default_image} alt="user" class="chat-message-img" /><span><span class="chat-message-header"><h3 class="username">${username}</h3> <p class="timestamp">${time}</p></span><p class="chat-message">${text}</p></span>`)
                    parent_element.append(new_element);
                });
            }
            }
            catch(e){
                console.log(e)
            }
        }
        getMessages();
        ws.current = new WebSocket(`ws://localhost:8000/ws?username=${props.username}`);
        ws.current.onopen = () => {
            console.log("Fetching messages");
        }
        ws.current.onclose = () => {
            console.log("connection closed");
        }
        ws.current.onmessage = (e) => {
            try {
                console.log(e)
                const element = document.querySelector(".msgs");
                let res = JSON.parse(e.data)
                let text = res.msg;
                let username = res.username;
                let time = new Date(res.time_sent);
                let expiry = new Date(res.expiry);
                time = time.toLocaleTimeString([], {hour : "2-digit", minute : "2-digit"});
                let new_element = document.createElement("li");
                new_element.className = "chat-message-block";
                new_element.id = expiry;
                new_element.innerHTML = (`<img src=${default_image} alt="user" class="chat-message-img" /><span><span class="chat-message-header"><h3 class="username">${username}</h3> <p class="timestamp">${time}</p></span><p class="chat-message">${text}</p></span>`)
                element.append(new_element);
            }
            catch {
                console.log("Error occured in the message");
            }
        }
        ws.current.onerror = () => {
            if (ws.current.OPEN) {
                ws.current.close();
            }
            console.log("An error occured");
        }
    }, [])
    function sendMsg() {
        if (ws.current && ws.current.readyState == WebSocket.OPEN) {
            if (msg.trim() == "") {
                return;
            }
            let message = {
                "msg" : msg,
                "expire" : yapDuration
            }
            ws.current.send(JSON.stringify(message));
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
    function enterKeyHandler(e) {
        if (e.key == "Enter") sendMsg();
    }
    function msgDisplay(time) {
        let date = new Date();
        console.log(date)
        date.setSeconds(date.getSeconds() + 15)
        console.log(date)
        // const element = document.querySelector("")
    }
    msgDisplay();
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
                            <textarea placeholder="Enter message" ref={textArea} value={msg} onChange={changeHandler} className="send-message" onKeyDown={enterKeyHandler} />
                            <div className="chat-yap-duration">
                                <span>Duration: </span>
                                <input type="range" value={yapDuration} min={5} max={300} step={5} onChange={yapDurationhandler} />
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