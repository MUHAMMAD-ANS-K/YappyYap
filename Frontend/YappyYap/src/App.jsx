import { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./Signup";
import OTPForm from "./OTPForm";
import Nav from "./Nav.jsx"
import Home from "./Home.jsx";
import About from "./About.jsx";
import Footer from "./Footer.jsx";
import ContactUs from "./ContactUs.jsx";
import Blog from "./Blog.jsx";
import { HashRouter, Routes, Route, BrowserRouter } from 'react-router-dom'
import Dashboard from "./Dashboard.jsx";

export default function App() {
    const [email, setEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [signedin, setSignedin] = useState(false);
    return (
        <BrowserRouter>
        <div>
            <Nav logged = {signedin}></Nav>
            {/* {otpSent == false? (<SignUp setEmail = {setEmail} setOtpSent = {setOtpSent}/>):(<OTPForm email = {email} setSignedin = {setSignedin}/>)} */}
            <Routes>
                <Route path="/signin" element={<SignIn setEmail = {setEmail} setOtpSent = {setOtpSent}/>}/>
                <Route path="/signup" element={<SignUp setEmail = {setEmail} setOtpSent = {setOtpSent}/>}/>
                <Route path="/signin/otp" element={<OTPForm email = {email} setSignedin = {setSignedin} link={"/acc-verify"}/>}/>
                <Route path="/signup/otp" element={<OTPForm email = {email} setSignedin = {setSignedin} link={"/acc-create"}/>}/>
                <Route path="/blogs" element={<Blog/>}/>
                <Route path="/" element={<Home email = {email} setSignedin = {setSignedin}/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path = "/contactus" element={<ContactUs/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
            </Routes>
            <Footer></Footer>
       </div>
       </BrowserRouter>
    );
}