import { useEffect, useRef, useState } from "react"
import "./Chat.css"
export default function Chat() {
    const [msgs, setMsgs] = useState(Array());
    const msg = useRef(null)
    const ws = useRef(null)
    useEffect(()=>{
        ws.current = new WebSocket("ws://localhost:8000/ws")
        ws.current.onopen = ()=>{
            console.log("connection opened")
        }
        ws.current.onclose = ()=>{
            console.log("connection closed")
        }
        ws.current.onmessage = (e)=>{
            // try{
                const el = document.querySelector(".msgs");
                let text = e.data;
                let element = document.createElement("li");
                element.innerHTML = text;
                el.append(element)
            // }
            // catch{
            //     console.log("Error occured in the message")
            // }
        }
        ws.current.onerror = ()=>{
            console.log("An errro occured")
        }
    },[])
    function sendMsg(){
        if (ws.current && ws.current.readyState == WebSocket.OPEN){
            ws.current.send(msg.current.value)
        }
        msg.current.value = "";
    }
    return (
        <div className="chat">
            <input type="text" placeholder="Enter message" ref={msg}/>
            <button onClick={sendMsg}>Send</button>
            <ul className="msgs">

            </ul>
        </div>
    )
}