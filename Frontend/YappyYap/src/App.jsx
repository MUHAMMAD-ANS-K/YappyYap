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
import {Routes, Route, BrowserRouter, useLocation } from 'react-router-dom'
import Dashboard from "./Dashboard.jsx";
import NotFound from "./404.jsx";
import Chat from "./Chat.jsx";
import { DashboardAuthProvider } from "../hooks/useDashAuth.jsx";

export default function App() {
    const [email, setEmail] = useState("");
    const [signedin, setSignedin] = useState(false);
    const [selectOption, setOption] = useState("NewsLetter");
    const [footerEmail, setFooterEmail] = useState();
    const [username, setName] = useState("Test123");
    const loc = useLocation();
    const hidePaths = ["/chat"]
    const hidePathBoolean = hidePaths.includes(loc.pathname);
    return (
        <div>
            {!hidePathBoolean && <Nav logged = {signedin} />}
            <div className="main-navbar-helper">
            <Routes>
                <Route path="/signin" element={<SignIn setEmail = {setEmail} logged={signedin}/>}/>
                <Route path="/signup" element={<SignUp setEmail = {setEmail} logged={signedin}/>}/>
                <Route path="/signin/otp" element={<OTPForm email = {email} setSignedin = {setSignedin} link={"/acc-verify"} logged={signedin} />}/>
                <Route path="/signup/otp" element={<OTPForm email = {email} setSignedin = {setSignedin} link={"/acc-create"} logged={signedin} />}/>
                <Route path="/blogs" element={<Blog logged={signedin}/>}/>
                <Route path="/" element={<Home email = {email} setSignedin = {setSignedin} logged={signedin}/>}/>
                <Route path="/about" element={<About logged={signedin}/>}/>
                <Route path = "/contactus" element={<ContactUs footerEmail = {footerEmail} setFooterEmail={setFooterEmail} selectOption={selectOption} setOption = {setOption} logged={signedin}/>}/>
                <Route path="/dashboard/*" element={<DashboardAuthProvider><Dashboard logged={signedin}/></DashboardAuthProvider>}/>
                <Route path="/chat" element={<Chat username = {username}/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
            {!hidePathBoolean && <Footer setOption = {setOption} setFooterEmail = {setFooterEmail}/>}
       </div>
               </div>
    );
}