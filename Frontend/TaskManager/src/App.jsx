import { useState } from "react";
import SignIn from "./SignIn";
import OTPForm from "./OTPForm";

export default function App() {
    const [email, setEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    return (
        <div>
            {otpSent == false? (<SignIn setEmail = {setEmail} setOtpSent = {setOtpSent}/>):(<OTPForm email = {email}/>)
       }
       </div>
    );
}