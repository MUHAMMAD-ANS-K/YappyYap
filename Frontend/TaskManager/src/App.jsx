import { useState } from "react";
import SignIn from "./SignIn";
import OTPForm from "./OTPForm";
import Nav from "./Nav.jsx"

export default function App() {
    const [email, setEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [signedin, setSignedin] = useState(false);
    return (
        <div>
            <Nav logged = {signedin}></Nav>
            {otpSent == false? (<SignIn setEmail = {setEmail} setOtpSent = {setOtpSent}/>):(<OTPForm email = {email} setSignedin = {setSignedin}/>)
       }
       </div>
    );
}