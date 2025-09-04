import { useEffect, useRef, useState } from "react"
import "./Voice.css"
import useAxios from "../hooks/useAxios";
export default function Voice() {
   const [start, setStart] = useState(false)
   const [pause, setPause] = useState(false)
   const axios = useAxios()
   const recorder = useRef(null);
    let data = [];
            async function startRecord() {
                if (!start) {
                    try{
                        const stream = await navigator.mediaDevices.getUserMedia({audio:{
                            noiseSuppression : false,
                            sampleRate : 16000,
                            channelCount : 1
                        }});
                        recorder.current = new MediaRecorder(stream)
                        recorder.current.start()
                        console.log(recorder.current.state)
                        recorder.current.ondataavailable = (e)=>{
                            data.push(e.data)
                            console.log("Data pushing")
                        }
                        recorder.current.onstop = async (e)=>{
                            let blob;
                            if (MediaRecorder.isTypeSupported("audio/webm")) {
                                blob = new Blob(data, {
                                    type: "audio/webm"
                                })
                                console.log("Webm supported")
                            }
                            else{
                                blob = new Blob(data, {
                                    type: "audio/ogg"
                                })
                            }
                            let data_send = new FormData()
                            data_send.append("file", blob)
                            try{
                                const response = await axios.post("/voice", data_send, {
                                    responseType : "blob"
                                })
                                data = [];
                                console.log(response.data)
                                const audioEl = document.createElement("audio")
                                audioEl.setAttribute("controls", "");
                                audioEl.src = window.URL.createObjectURL(response.data)
                                document.querySelector(".test-audio").appendChild(audioEl)
                                console.log("Data Sent")
                            }
                            catch (e) {
                                console.log(e)
                            }
                            setPause(false)
                        }
                    }
                    catch(e){
                        console.log(e)
                    }
                }
                else{
                    if (recorder.current) {
                        recorder.current.stop();
                    }
                }
                setStart(n => !n);
            }
            async function pauseHandler() {
                if (recorder.current) {
                    if (pause) {
                        recorder.current.resume();
                    }
                    else{
                        recorder.current.pause();
                    }
                    setPause(n => !n);
                }
            }
            async function testSend() {
                
            }
                    return(
                        <div className="voice">
                            <div className="recorder">
                                <div className="recorder-buttons">
                                    <button className="start-record" onClick={startRecord}>{start ? "Stop" : "Start"}</button>
                                    <button className="pause-button" onClick={pauseHandler} disabled={!start}>{pause ? "Resume" : "Pause"}</button>
                                    <button className="test-button" onClick={testSend}>Test Send</button>
                                </div>
                            </div>
                            <div className="test-audio">
                            </div>
                        </div>
                    )
}