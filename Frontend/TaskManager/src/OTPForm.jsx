import { useState } from "react"
import { Link } from "react-router-dom";
import axios from "axios";
export default function OTPForm(props) {
    const [otp, setOtp] = useState("");
    const [msg, setMsg] = useState("");

    async function otpVerification(){
        try {
            const response = await axios.post("http://localhost:8000/verify",{
                email : props.email,
                otp : otp
            })
            setMsg("Successfully logged in");
            props.setSignedin(true);
        }
        catch (err) {
            setMsg("Invalid or expired OTP");
        }
    }

    return (
        <div className="background_signin">
            <h2>Enter the OTP sent to your mail</h2>
            <ul style={{alignItems:"center"}}>
                <li>  
            <div className="input">
            <input type="text" value = {otp}
            onChange={(e) => setOtp(e.target.value)}/>
            </div>
                </li>
                <li>
                    
            
            <button onClick={otpVerification} className="sign-button">Verify</button>
            <p style = {msg == "Successfully logged in" ? {color : "green"} : {color : "red"}}>{msg}</p>
                </li>
            </ul>
        </div>
    )
}