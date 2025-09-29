import { useState } from "react"
import default_image from "./../assets/default_img.png"
import { Link, useLocation } from "react-router-dom";
export default function ChatSideBar(props) {
    // const [navOpen, setNavopen] = useState(false);
    function navbarSimulator() {
        if (window.innerWidth <= 1000){
            const element = document.querySelector(".chat-area")
            if(props.navOpen){
                element.classList.add("nav-close-styles");
                element.classList.remove("nav-open-styles");
            }
            else{
                element.classList.add("nav-open-styles");
                element.classList.remove("nav-close-styles")
            }
            props.setNavopen((n)=>!n);
        }
    }
    function testfunc(e) {
        if (!props.navOpen)
            e.stopPropagation()
    }
    return(
        <div className="chat-sidearea" onClick={navbarSimulator}>
            <h2 className="chat-sidearea-heading">
                <span className="realms-r-replacement">R</span>
            <span className="ealms">ealms</span>
            </h2>
            <hr />
            <ul className="realms-list">
                <Link to="/chat/global" className="global-realm" onClick={testfunc}><li><span className="dot-realm-style"></span><span className="channel-hashtag">#</span><span className="realm-button">global</span></li></Link>
                <Link to="/chat/voice" className="voice-realm" onClick={testfunc}><li><span className="dot-realm-style"></span><span className="channel-hashtag">#</span><span className="realm-button">voice</span></li></Link>
                {/* <li><span className="dot-realm-style"></span><span className="channel-hashtag">#</span><button onClick={handleActiveRealm} className="realm-button hacker-realm">hacker</button></li> */}
            </ul>
            <div className="user-profile">
                <Link to="/account">
                <img src={default_image} alt="user" className="user-profile-pic" />
                <p>{props.username}</p>
                </Link>
            </div>
        </div>
    )
}