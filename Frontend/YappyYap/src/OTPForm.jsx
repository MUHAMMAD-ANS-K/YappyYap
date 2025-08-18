import { useState } from "react"
import useAxios from "../hooks/useAxios";
import { useNavigate } from "react-router-dom";
import useChatAuth from "../hooks/useChatAuth";
export default function OTPForm(props) {
    const [otp, setOtp] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {setUsername} = useChatAuth();
    const {setLogged} = useChatAuth();
    async function otpVerification(){
        setLoading(true);
        const axios = useAxios();
        try {
            const response = await axios.post(props.link,{
                email : props.email,
                otp : otp
            })
            if (response.data.msg == "Success"){
                setMsg("Successfully logged in");
                setLogged(true);
                setUsername(response.data.username);
                navigate("/chat")
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