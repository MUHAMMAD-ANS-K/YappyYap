import { Link } from "react-router-dom"
import "./Nav.css"
import { useState } from "react"
import { gsap } from "gsap"
import logo from "./assets/logo.png"
export default function Nav(props) {
    const [navOpen, setnavOpen] = useState(false);
    function hoverEnter() {
        gsap.to(".hoverEff", {
            width : "100%",
            duration : 0.1
        })
    }
    function hoverLeave() {
        console.log("hii")
        gsap.to(".hoverEff", {
            width : "0%",
            duration : 0.1
        })
    }
    function func() {
        if (!navOpen) {
            document.querySelector(".ham").style.display = "none";
            document.querySelector(".cross").style.display = "inline";
            document.querySelector(".nav-hr").style.display = "none";
            document.querySelector(".navbar-items").style.display = "flex";
            const element = document.querySelector(".navbar").style;
            element.flexDirection = "column";
            element.width = "100vw";
            element.height = "100vh";
            element.justifyContent = "flex-start";
            const element2 = document.querySelector(".menubar").style;
            element2.position = "absolute";
            element2.right = "30px";
            
            setnavOpen(true);
        }
        else{
            const element = document.querySelector(".navbar").style;
            element.width = "auto";
            element.height = "auto";
            element.flexDirection = "row"
            element.justifyContent = "space-between";
            const element2 = document.querySelector(".menubar").style;
            element2.position = "relative";
            element2.right = "0px";
            document.querySelector(".cross").style.display = "none";
            document.querySelector(".ham").style.display = "inline";
            document.querySelector(".navbar-items").style.display = "none";
            document.querySelector(".nav-hr").style.display = "block";
            setnavOpen(false);
        }
    }
    return (
        <nav>
            <div className="navbar">

                <Link to="/"><img src={logo} alt="YappyYap" /></Link>
                
                <button className="menubar" onClick={func} onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}><span className="hoverEff"></span><span style={{ fontSize: "0.8rem" }}>Menu</span><span className="ham">≡</span> <span className="cross">X</span> </button>
                <ul className="navbar-items">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li>{props.logged ? (<Link to="account">My Account</Link>) : (<><Link to="signin">SignIn</Link> <span>|</span> <Link to="signin">SignUp</Link></>)}</li>
                </ul>
            </div>
            <hr className="nav-hr"/>
        </nav>
    )
}