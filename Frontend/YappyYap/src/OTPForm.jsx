import { useState } from "react"
import useAxios from "../hooks/useAxios";
import { Navigate } from "react-router-dom";
export default function OTPForm(props) {
    const [otp, setOtp] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    async function otpVerification(){
        setLoading(true);
        const axios = useAxios();
        try {
            const response = await axios.post(props.link,{
                email : props.email,
                otp : otp
            })
            if (response.data.msg === "Success"){
                setMsg("Successfully logged in");
                props.setSignedin(true);
                props.setName(response.data.username);
                <Navigate to="/chat" replace/>
            }
        }
        catch (err) {
            setMsg("Invalid or expired OTP");
        }
        finally{
            setLoading(false);
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
                    
            
            <button onClick={otpVerification} className="sign-button" disabled={loading}>{loading ? "Verifying..." : "Verify"}</button>
            <p style = {msg == "Successfully logged in" ? {color : "green"} : {color : "red"}}>{msg}</p>
                </li>
            </ul>
        </div>
    )
}