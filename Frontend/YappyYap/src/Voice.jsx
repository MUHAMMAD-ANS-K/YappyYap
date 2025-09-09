import { useEffect, useRef, useState } from "react"
import "./Voice.css"
import { gsap } from "gsap/gsap-core";
import { useGSAP } from "@gsap/react";
import useAxios from "../hooks/useAxios";
export default function Voice() {
   const [start, setStart] = useState(false)
   const pause = useRef(false)
   const [pauseState, setPause] = useState(false)
   const [timer, setTimer] = useState(0)
   const [yapDuration, setyapDuration] = useState(10)
   const recorderInterval = useRef()
   const barInterval = useRef()
   const recorderFreq = useRef()
   const axios = useAxios()
   const recorder = useRef(null);
    let data = [];
    useEffect(()=>{
        recorderFreq.current = document.querySelector(".recorder-freq")
        return ()=>{    
            if (recorderInterval.current)
                clearInterval(recorderInterval)
            if (barInterval.current)
                clearInterval(barInterval)
        }
        
    },[])
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
                        recorderInterval.current = setInterval(inputTimer, 1000);
                        barInterval.current = setInterval(barCreator, 600)
                        console.log(recorder.current.state)
                        recorder.current.ondataavailable = (e)=>{
                            data.push(e.data)
                            console.log("Data pushing")
                        }
                        recorder.current.onstop = async (e)=>{
                            clearInterval(recorderInterval.current)
                            clearInterval(barInterval.current)
                            setTimer(0);
                            recorderFreq.current.innerHTML = ""
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
                        }
                    }
                    catch(e){
                        console.log(e)
                    }
                }
                else{
                    if (recorder.current) {
                        setPause(false)
                        pause.current = false;
                        recorder.current.stop();
                    }
                }
                setStart(n => !n);
            }
            async function pauseHandler() {
                if (recorder.current) {
                    if (pause.current) {
                        recorder.current.resume();
                    }
                    else{
                        recorder.current.pause();
                    }
                    setPause(n => !n);
                    pause.current = !pause.current
                }
            }
            function inputTimer() {
                if (!pause.current) {
                    setTimer(t => t+1)
                }
            }
            function barCreator(){
                if (!pause.current){
                    console.log(recorderFreq.current.offsetWidth)
                    
                    const element = document.createElement("div")
                    element.style.height = `${Math.random() * 12 + 3}px `
                    element.classList.add("bar")
                    recorderFreq.current.append(element)
                    console.log(element)
                }
            }
                    return(
                        <>
                        <div className="voice">
                            <div className="recorder type-area">
                                <div className="recorder-count">
                                    <span>{timer}</span>
                                </div>
                                <div className="recorder-freq">
                                    <div className="bar"></div>
                                </div>
                            <div className="chat-yap-duration">
                                <span className="duration-label">Duration: </span>
                                <input type="range" min={10} max={300} step={5} value={yapDuration} onChange={(e)=>setyapDuration(e.target.value)} />
                                <span id="chat-yap-duration">{`${yapDuration}s`}</span>
                            </div>
                                <div className="recorder-buttons">
                                    <button className="start-record send-button" onClick={startRecord}>{!start ? (<svg className="chat-sendsvg"xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 256 256" xml:space="preserve">
                                    <g stroke= "none" strokeWidth="0" strokeDasharray="none" strokeLinecap= "butt" strokeLinejoin= "miter" strokeMiterlimit= "10" fill= "none" fillRule= "nonzero" opacity= "1" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                                    <path d="M 45 70.968 c -16.013 0 -29.042 -13.028 -29.042 -29.042 c 0 -1.712 1.388 -3.099 3.099 -3.099 c 1.712 0 3.099 1.388 3.099 3.099 C 22.157 54.522 32.404 64.77 45 64.77 c 12.595 0 22.843 -10.248 22.843 -22.843 c 0 -1.712 1.387 -3.099 3.099 -3.099 s 3.099 1.388 3.099 3.099 C 74.042 57.94 61.013 70.968 45 70.968 z" stroke= "none" strokeWidth= "1" strokeDasharray= "none" strokeLinecap= "butt" strokeLinejoin="miter" strokeMiterlimit= "10" fill="white" fillRule="nonzero" opacity= "1" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                                    <path d="M 45 60.738 L 45 60.738 c -10.285 0 -18.7 -8.415 -18.7 -18.7 V 18.7 C 26.3 8.415 34.715 0 45 0 h 0 c 10.285 0 18.7 8.415 18.7 18.7 v 23.337 C 63.7 52.322 55.285 60.738 45 60.738 z" stroke="none" strokeWidth="1" strokeDasharray="none" strokeLinejoin="miter" strokeMiterlimit="10" fill="white" fillRule="nonzero" opacity="1" transform=" matrix(1 0 0 1 0 0) " strokeLinecap="round"/>
                                    <path d="M 45 89.213 c -1.712 0 -3.099 -1.387 -3.099 -3.099 V 68.655 c 0 -1.712 1.388 -3.099 3.099 -3.099 c 1.712 0 3.099 1.387 3.099 3.099 v 17.459 C 48.099 87.826 46.712 89.213 45 89.213 z" stroke="none" strokeWidth="1" strokeDasharray="none" strokeLinejoin="miter" strokeMiterlimit="10" fill="white" fillRule="nonzero" opacity="1" transform=" matrix(1 0 0 1 0 0) " strokeLinecap="round"/>
                                    <path d="M 55.451 90 H 34.549 c -1.712 0 -3.099 -1.387 -3.099 -3.099 s 1.388 -3.099 3.099 -3.099 h 20.901 c 1.712 0 3.099 1.387 3.099 3.099 S 57.163 90 55.451 90 z" stroke="none" strokeWidth="1" strokeDasharray="none" strokeLinejoin="miter" strokeMiterlimit="10" fill="white" fillRule="nonzero" opacity="1" transform=" matrix(1 0 0 1 0 0) " strokeLinecap="round"/></g></svg>) :
                                    (
                                <svg className="chat-sendsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 21L23 12L2 3L6 12L2 21Z" />
                                    <path d="M6 12L23 12" />
                                </svg>)}</button>
                                     <button className="pause-button" onClick={pauseHandler} >{ start ? (pauseState ? (<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 96 96" xml:space="preserve">
<path d="M0 0 C4.70362174 0.50357681 7.48195529 2.58049538 11.3046875 5.2421875 C12.80074456 6.25588489 14.29817735 7.26755443 15.796875 8.27734375 C16.55838867 8.79312988 17.31990234 9.30891602 18.10449219 9.84033203 C20.38691677 11.3391018 22.70364272 12.73853322 25.0625 14.11328125 C25.7961377 14.54592285 26.52977539 14.97856445 27.28564453 15.42431641 C28.68691336 16.24478148 30.09656084 17.05114422 31.51513672 17.84130859 C34.68951593 19.73006827 36.25678193 20.92411698 37.6171875 24.41015625 C37.4296875 27.3671875 37.4296875 27.3671875 36.0234375 29.4140625 C32.47438901 32.08653877 28.75248051 34.35923651 24.9296875 36.6171875 C18.4163065 40.50490274 12.13888353 44.53109274 6.0078125 49.00390625 C2.92184948 50.63572609 0.87376598 50.70667524 -2.5703125 50.3671875 C-4.17082914 48.76667086 -3.69762722 47.07872628 -3.69970703 44.86328125 C-3.70285919 43.90558838 -3.70601135 42.94789551 -3.70925903 41.96118164 C-3.7072348 40.91953857 -3.70521057 39.87789551 -3.703125 38.8046875 C-3.70408173 37.74306396 -3.70503845 36.68144043 -3.70602417 35.58764648 C-3.70670614 33.33805278 -3.70485069 31.08845713 -3.70068359 28.83886719 C-3.6953356 25.38211679 -3.70062804 21.92549633 -3.70703125 18.46875 C-3.70637047 16.28906221 -3.70508932 14.1093745 -3.703125 11.9296875 C-3.70514923 10.88804443 -3.70717346 9.84640137 -3.70925903 8.77319336 C-3.70610687 7.81550049 -3.70295471 6.85780762 -3.69970703 5.87109375 C-3.69891144 5.02361572 -3.69811584 4.1761377 -3.69729614 3.30297852 C-3.50129542 0.31506261 -2.98834304 0.42690615 0 0 Z " fill="white" transform="translate(35.5703125,22.6328125)"/>
</svg>) : (<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 96 96" xml:space="preserve">
<path d="M0 0 C0.66 -0.0103125 1.32 -0.020625 2 -0.03125 C5.13341854 0.8010643 6.07865886 1.84316082 8 4.5 C8.61584573 8.07768499 8.56010028 11.62720889 8.53125 15.25 C8.5350769 16.30026367 8.53890381 17.35052734 8.54284668 18.43261719 C8.54556696 20.65170247 8.53819777 22.87081974 8.52148438 25.08984375 C8.50007745 28.48770595 8.52128325 31.88345361 8.546875 35.28125 C8.54423175 37.43750467 8.53910682 39.59375802 8.53125 41.75 C8.53934692 42.76674805 8.54744385 43.78349609 8.55578613 44.83105469 C8.46226768 51.86077417 8.46226768 51.86077417 6.09179688 55.13867188 C3.83648136 56.60641689 2.66961743 57.04171277 0 57 C-0.99 57.01546875 -0.99 57.01546875 -2 57.03125 C-5.13341854 56.1989357 -6.07865886 55.15683918 -8 52.5 C-8.61584573 48.92231501 -8.56010028 45.37279111 -8.53125 41.75 C-8.5350769 40.69973633 -8.53890381 39.64947266 -8.54284668 38.56738281 C-8.54556696 36.34829753 -8.53819777 34.12918026 -8.52148438 31.91015625 C-8.50007745 28.51229405 -8.52128325 25.11654639 -8.546875 21.71875 C-8.54423175 19.56249533 -8.53910682 17.40624198 -8.53125 15.25 C-8.53934692 14.23325195 -8.54744385 13.21650391 -8.55578613 12.16894531 C-8.46226768 5.13922583 -8.46226768 5.13922583 -6.09179688 1.86132812 C-3.83648136 0.39358311 -2.66961743 -0.04171277 0 0 Z " fill="white" transform="translate(64,19.5)"/>
<path d="M0 0 C0.66 -0.0103125 1.32 -0.020625 2 -0.03125 C5.13341854 0.8010643 6.07865886 1.84316082 8 4.5 C8.61584573 8.07768499 8.56010028 11.62720889 8.53125 15.25 C8.5350769 16.30026367 8.53890381 17.35052734 8.54284668 18.43261719 C8.54556696 20.65170247 8.53819777 22.87081974 8.52148438 25.08984375 C8.50007745 28.48770595 8.52128325 31.88345361 8.546875 35.28125 C8.54423175 37.43750467 8.53910682 39.59375802 8.53125 41.75 C8.53934692 42.76674805 8.54744385 43.78349609 8.55578613 44.83105469 C8.46226768 51.86077417 8.46226768 51.86077417 6.09179688 55.13867188 C3.83648136 56.60641689 2.66961743 57.04171277 0 57 C-0.99 57.01546875 -0.99 57.01546875 -2 57.03125 C-5.13341854 56.1989357 -6.07865886 55.15683918 -8 52.5 C-8.61584573 48.92231501 -8.56010028 45.37279111 -8.53125 41.75 C-8.5350769 40.69973633 -8.53890381 39.64947266 -8.54284668 38.56738281 C-8.54556696 36.34829753 -8.53819777 34.12918026 -8.52148438 31.91015625 C-8.50007745 28.51229405 -8.52128325 25.11654639 -8.546875 21.71875 C-8.54423175 19.56249533 -8.53910682 17.40624198 -8.53125 15.25 C-8.53934692 14.23325195 -8.54744385 13.21650391 -8.55578613 12.16894531 C-8.46226768 5.13922583 -8.46226768 5.13922583 -6.09179688 1.86132812 C-3.83648136 0.39358311 -2.66961743 -0.04171277 0 0 Z " fill="white" transform="translate(32,19.5)"/>
</svg>)) : ""}</button>
                                </div>
                            </div>
                        </div>
                        </>
                    )
}