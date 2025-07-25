import {useState} from "react"
import "./SignIn.css"

export default function SignIn(props) {
    const [email, setEmail] = useState("");
    function sendOtp(){
        try{
            props.setEmail(email);
            props.setOtpSent(true);
            console.log("OTP sent");
        }
        catch{
            console.log("OTP sent failed");
        }
    }
    return (
        <div className="background_signin">
        <div>
        <h2>Enter your email</h2>
        <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="username@domain.com"
        />
        <button onClick={sendOtp} >Send OTP</button>
        </div>
        </div>
    )
}