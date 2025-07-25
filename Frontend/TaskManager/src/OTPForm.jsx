import { useState } from "react"

export default function OTPForm(props) {
    const [otp, setOtp] = useState("");
    const [msg, setMsg] = useState("");

    function otpVerification(){
        try {
            //check otp verification
            setMsg("Successfully logged in");
        }
        catch (err) {
            setMsg("Invalid or expired OTP");
        }
    }

    return (
        <div className="background_signin">
            <h2>Enter the OTP sent to {props.email}</h2>

            <input type="text" value = {otp}
            onChange={(e) => setOtp(e.target.value)}/>
            
            <button onClick={otpVerification}>Verify</button>
            <p style = {msg == "Successfully logged in" ? {color : "green"} : {color : "red"}}>{msg}</p>
        </div>
    )
}