import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Footer.css"
export default function Footer(props){
    const navigation = useNavigate();
    function emailHandler() {
        const emailElement = document.querySelector(".footer-email");
        props.setFooterEmail(emailElement.value)
        emailElement.value = "";
        props.setOption("NewsLetter")
        navigation("contactus");
    }   
    return (
        <footer>
        <nav className="footer-navigation">
            <div>
            <h3>Stay tuned for any updates.</h3>
            <div className="footer-email-form">
                <input type="email" placeholder="Enter your Email" className="footer-email"/>
                <button onClick={emailHandler} className="footer-button">&rarr;</button>
            <hr className="footer-hr"/>
            </div>
            </div>
            <div className="footer-list">
                <p>YappyYap</p>
            <ul className="Footer-flex">    
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contactus">Contact Us</Link></li>
                <li><Link to="/blogs">Blog</Link></li>
            </ul>
            </div>
            <div className="footer-list">
                <p>Connect</p>
                <ul className="Footer-flex">
                    <li><a href="https://www.instagram.com/yappy__yap/"target="_blank">Instagram</a></li>
                    <li><a href="https://github.com/MUHAMMAD-ANS-K/YappyYap" target="_blank">GitHub</a></li>
                </ul>
            </div>
        </nav>
        <div className="footer-copyright">
        <p>&copy;2025 YappyYap - All rights reserved.</p>
        <p><Link to='privacy-policy'>Privacy Policy</Link>. <Link to="terms">Terms of Use</Link></p>
        </div>
        </footer>
    )
}