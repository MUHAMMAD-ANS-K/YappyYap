import { Link } from "react-router-dom";
// import {axios}
import "./Footer.css"
export default function Footer(){
    function emailhHandler(e) {
        
    }
    return (
        <footer>
        <nav className="footer-navigation">
            <div>
            <h3>Stay tuned for any updates.</h3>
            <div className="footer-email-form">
            <form onSubmit="">
                <input type="email" placeholder="Enter your Email" className="footer-email"/>
                <button type="submit" className="footer-button">&rarr;</button>
            </form>
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
                    <li><Link to="https://instagram.com">Instagram</Link></li>
                    <li><Link to="https://youtube.com">Youtube</Link></li>
                    <li><Link to="https://facebook.com">Facebook</Link></li>
                    <li><Link to="https://linkedin.com">LinkedIn</Link></li>
                    <li><Link to="https://github.com">GitHub</Link></li>
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