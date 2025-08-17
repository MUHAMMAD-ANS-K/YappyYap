import { useState } from "react"
import default_image from "./../assets/default_img.png"
export default function ChatSideBar(props) {
    const [navOpen, setNavopen] = useState(false);
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
    function handleActiveRealm(e) {
        const classname = `${e.target.textContent}-realm`;
        document.querySelector(`.${props.realm}`).style.color = "rgba(255, 255, 255, 0.277)";
        document.querySelector(`.${classname}`).style.color = "#10B981";
        props.setRealm(`${classname}`);
    }
    return(
        <div className="chat-sidearea" onClick={navbarSimulator}>
            <h2 className="chat-sidearea-heading">
                <span className="realms-r-replacement">R</span>
            <span className="ealms">ealms</span>
            </h2>
            <hr />
            <ul className="realms-list">
                <li><span className="dot-realm-style"></span><span className="channel-hashtag">#</span><button onClick={handleActiveRealm} className="realm-button global-realm">global</button></li>
                {/* <li><span className="dot-realm-style"></span><span className="channel-hashtag">#</span><button onClick={handleActiveRealm} className="realm-button hacker-realm">hacker</button></li> */}
            </ul>
            <div className="user-profile">
                <img src={default_image} alt="user" className="user-profile-pic" />
                <p>{props.username}</p>
            </div>
        </div>
    )
}