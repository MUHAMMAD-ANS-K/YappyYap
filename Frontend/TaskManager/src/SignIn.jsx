import {useState} from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import "./SignIn.css"

export default function SignIn(props) {
    const [email, setEmail] = useState("");
    function sendOtp(){
        try{
            const resp = axios.post("http://localhost:8000/", {
                email: email
            })
            props.setEmail(email);
            props.setOtpSent(true);
        }
        catch{
            console.log("OTP sent failed");
        }
    }
    return (
        <div className="background_signin">
            <div className="signin-up">
                <h2 className="signin-up-heading">Sign In</h2>
                <p className="signin-up-p">Don't have an account. <a className="signin-up-a" href="./signup">Sign Up</a></p>
                <hr />
            </div>
        <ul>
            <li>
                <label>
                    Enter your email
                </label>
                <div className="input">                    
                <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
        </li>

        <li>
        <button className="sign-button" onClick={sendOtp} ><Link to="send-otp">Send OTP</Link></button></li>
        </ul>
        </div>
    )
}