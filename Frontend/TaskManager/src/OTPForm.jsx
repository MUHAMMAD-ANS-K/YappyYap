import { useState } from "react"
import { Link } from "react-router-dom";
export default function OTPForm(props) {
    const [otp, setOtp] = useState("");
    const [msg, setMsg] = useState("");

    function otpVerification(){
        try {
            //check otp verification
            setMsg("Successfully logged in");
            props.setSignedin(true);
        }
        catch (err) {
            setMsg("Invalid or expired OTP");
        }
    }

    return (
        <div className="background_signin">
            <h1>Enter the OTP sent to {props.email}</h1>
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