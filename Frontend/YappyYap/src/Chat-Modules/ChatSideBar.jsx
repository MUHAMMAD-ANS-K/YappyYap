import { useState } from "react"
import default_image from "./../assets/default_img.png"
import { Link, useLocation } from "react-router-dom";
export default function ChatSideBar(props) {
    const [navOpen, setNavopen] = useState(false);
    const location = useLocation()
    function navbarSimulator(e) {
        console.log(location.pathname)
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
        e.stopPropagation()
    }
    function handleActiveRealmSib(e) {
        const classname = `${e.target.parentNode.children[2].textContent}-realm`
        document.querySelector(`.${props.realm}`).style.color = "rgba(255, 255, 255, 0.277)"
        document.querySelector(`.${classname}`).style.color = "#10B981"
        props.setRealm(`${classname}`);
        // e.stopPropagation
    }
    function testfunc(e) {
        // const element = e.currentTarget;
        // console.log(element.parentNode.children)
        // const temp = element.parentNode.children;
        // for(const sibling of temp){
        //     if (sibling.classList.contains("current-realm")) {
        //         sibling.classList.remove("current-realm")
        //     }
        // }
        // for(let i = 0; i < temp.length; i++)
        // element.classList.add("current-realm")
        // props.setRealm(element.classList[0])
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
                <img src={default_image} alt="user" className="user-profile-pic" />
                <p>{props.username}</p>
            </div>
        </div>
    )
}