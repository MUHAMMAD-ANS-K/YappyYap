import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap/gsap-core";
import {useGSAP} from "@gsap/react"
import "./Home.css"
// import {useGSAP} 
export default function Home() {
    const [invert, setInvert] = useState(false);
    useGSAP(()=>{
    let timeline1 = gsap.timeline();
    let timeline2 = gsap.timeline();
    let upsideTimeline = gsap.timeline();
    upsideTimeline.from(".upside-down",{
        opacity: 0,
        scaleY: -1,
        translateY: 20,
        duration:1,
        stagger: 0.2,
        ease: "sine.inOut"
    })
    timeline1.from(".left-side-rotating", {
        x: -20,
        scale: 0.5,
        opacity:0,
        stagger: 0.2,
        rotate: "500deg",
        ease: "sine.inOut"
    })
    timeline1.from(".left-side", {
        scale: 0.5,
        translateX: -30,
        opacity: 0,
        stagger: 0.2,  
        ease: "sine.inOut"
    })
    timeline2.from(".down-rotating", {
        scale: 0.5,
        translateY: 30,
        opacity: 0,
        rotate: "600deg",
        ease: "sine.inOut",
        stagger: 0.2
    })
    timeline2.from(".down", {
        opacity: 0,
        translateY: 20,
        stagger: 0.2,
        ease: "sine.inOut"
    })
    upsideTimeline.from(".invert-infinite", {
        scaleY: 1,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        repeatDelay: 2,
        delay: 2,
    });
},[])
    return (
        <main>
            <h1 className="main-h1">
                <div className="first-part">
<span className="upside-down">A</span>
            <span className="left-side-rotating">n</span>
            <span className="left-side">o</span>
            <span className="left-side-rotating">n</span>
            <span className="down">y</span>
            <span className="left-side">m</span>
            <span className="down-rotating">i</span>
            <span className="upside-down">t</span>
            <span className="down">y</span> 
            <span className="left-side">,</span>
                </div>
                
            <div className="second-part">
            <span className="upside-down">N</span>
            <span className="left-side">o</span> <span className="down">R</span>
            <span className="left-side-rotating">e</span>
            <span className="left-side-rotating">s</span>
            <span className="invert-infinite upside-down">t</span>
            <span className="left-side-rotating">r</span>
            <span className="down-svg">i</span>
            <span className="down-rotating">c</span>
           
            <span className="invert-infinite upside-down">t</span>
            <span className="down">i</span>
            <span className="left-side">o</span>
            <span className="left-side-rotating">n</span>
            <span className="down-rotating">s</span>
            </div>
</h1>
            <p><span className="curly-bracket">{"{"}</span>Yap as much as you want on YappyYap. Say whatever you want.
                <span className="curly-bracket">{"}"}</span></p>
            <button><Link to="/signup">Join Now</Link></button>
            <hr />
            <div>
                <p>Ever wanted to chat in an environment with no restrictions and anonymous identity. You are in the right place.</p>
                <h2></h2>
            </div>
        </main>
    );
}