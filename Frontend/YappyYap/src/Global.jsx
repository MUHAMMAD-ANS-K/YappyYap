import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap/gsap-core"
import useAxios from "../hooks/useAxios"
import default_image from "./assets/default_img.png"
export default function Global(){
    const [msg, setMsg] = useState("");
    const textArea = useRef();
    const ws = useRef(null);
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [strike, setStrike] = useState(false);
    const [optionsOpen, setOptionsOpen] = useState(false);
    const [yapDuration, setYapDuration] = useState(10);
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
        const element = document.querySelector(".global-realm");
        element.classList.add("current-realm");
        const axios = useAxios()
        async function getMessages () {
            try{
                const messages = await axios.get("/getchatmsgs")
                if (messages.data.msg == "Success") {
                    const response = messages.data.msgs;
                    const parent_element = document.querySelector(".msgs");
                    parent_element.innerHTML = "";
                response.forEach(element => {
                    let time = new Date(element.time_sent);
                    let expiry = new Date(element.expiry);
                    if (expiry - new Date() > 1500){
                        let text = element.msg;
                        let username = element.username;
                        time = time.toLocaleTimeString([], {hour : "2-digit", minute : "2-digit"})
                        let new_element = document.createElement("li");
                        expiry = expiry.toString().replace(/\s+/g, "-").replace(/[:+().]/g, "-");
                        new_element.classList.add(expiry, "chat-message-block")
                        new_element.innerHTML = (`<img src=${default_image} alt="user" class="chat-message-img" /><span><span class="chat-message-header"><h3 class="username">${username}</h3> <p class="timestamp">${time}</p></span><p class="chat-message">${text}</p></span>`)
                        parent_element.append(new_element);
                    }
                });
            }
        }
        catch(error){
            console.warn("Connection to server failed")
        }
    }
    const interval1 = setInterval(getMessages, 20000)
    const interval2 = setInterval(()=>msgDisplay(2), 1000);
    const interval3 = setInterval(()=>msgDisplay(-2), 1000);
    let webreconInterval  = 2000;
    function connect() {
        // ws.current = new WebSocket(`wss://api.muhammadans.com/ws`);
        ws.current = new WebSocket(`ws://localhost:8000/ws`);
        console.log(ws.current)
        ws.current.onopen = () => {
            console.log("Fetching messages");
            getMessages()
        }
        ws.current.onclose = () => {
            console.log("connection closed");
            if (ws.current.readyState == 0){
                reconnect();
            }
        }
        ws.current.onmessage = (e) => {
            try {
                const element = document.querySelector(".msgs");
                let res = JSON.parse(e.data)
                let time = new Date(res.time_sent);
                let expiry = new Date(res.expiry);
                
                if (expiry - new Date() > 1500){
                    let text = res.msg;
                    let username = res.username;
                    time = time.toLocaleTimeString([], {hour : "2-digit", minute : "2-digit"});
                    let new_element = document.createElement("li");
                    expiry = expiry.toString().replace(/\s+/g, "-").replace(/[:+().]/g, "-");
                    new_element.classList.add(expiry, "chat-message-block")
                    new_element.innerHTML = (`<img src=${default_image} alt="user" class="chat-message-img" /><span><span class="chat-message-header"><h3 class="username">${username}</h3> <p class="timestamp">${time}</p></span><p class="chat-message">${text}</p></span>`)
                    element.append(new_element);
                }
            }
            catch (error) {
                console.warn("Error occured in the message");
            }
        }
        ws.current.onerror = () => {
            if (ws.current.OPEN) {
                ws.current.close();
            }
            console.warn("An error occured");
        }
    }
    connect();
    function reconnect() {
        setTimeout(connect, webreconInterval);
        webreconInterval += 1000;
    }

        return ()=> {
            clearInterval(interval1);
            clearInterval(interval2);
            clearInterval(interval3);
            element.classList.remove("current-realm")
        }
    }, [])
    // const [msgs, setMsgs] = useState(Array());
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
    function sendMsg() {
        if (msg.trim() == "") {
            return;
        }
        if (ws.current && ws.current.readyState == WebSocket.OPEN) {
            let message = {
                "msg" : msg.trim(),
                "expire" : yapDuration
            }
            ws.current.send(JSON.stringify(message));
        }
        
        textArea.current.value = "";
        // textArea.current.focus()
        setMsg("");
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
    function enterKeyHandler(e) {
        if (e.key == "Enter") {
            sendMsg();
        e.preventDefault();
        }
    }
    async function msgDisplay(time) {
        let date = new Date();
        date.setSeconds(date.getSeconds() + time)
        date = date.toString().replace(/\s/g, "-").replace(/[:+().]/g, "-");
        const el = document.querySelectorAll(`.${date}`);
        if (el.length > 0) {
            gsap.to(`.${date}`,{
                opacity : 0,
                duration : 2,
            })
            setTimeout(()=>{
                for (const element of el) {
                    element.remove()
                }
            }, 2000)
        }
    }
        return (
            <>
                    <div className="msgs-helper">
                        <ul className="msgs">
                            <li className="chat-message-block">
                                <img src={default_image} alt="user" className="chat-message-img" />
                                <span>
                                    <span className="chat-message-header"><h3 className="username">Username</h3> <p className="timestamp">12:00am</p></span>
                                    <p className="chat-message">--Welcome--</p>
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className="type-area-overlay">
                        <div className="type-area" onKeyDown={enterKeyHandler}>
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
                                <input type="range" value={yapDuration} min={10} max={300} step={5} onChange={yapDurationhandler} />
                                <span id="chat-yap-duration">{`${yapDuration}s`}</span>
                            </div>
                            <button onClick={sendMsg} className="send-button">
                                <svg className="chat-sendsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 21L23 12L2 3L6 12L2 21Z" />
                                    <path d="M6 12L23 12" />
                                </svg></button>
                        </div>
                    </div>
                    </>
    )
}