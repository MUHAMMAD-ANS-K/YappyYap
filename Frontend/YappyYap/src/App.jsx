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
import { ChatAuthProvider } from "../hooks/useChatAuth.jsx";
import ChatProtection from "./ChatProtection.jsx";
export default function App() {
    const [email, setEmail] = useState("");
    const [selectOption, setOption] = useState("NewsLetter");
    const [footerEmail, setFooterEmail] = useState();
    const loc = useLocation();
    const hidePaths = ["/chat"]
    const hidePathBoolean = hidePaths.includes(loc.pathname);
    return (
        <ChatAuthProvider>
        <div>
            {!hidePathBoolean && <Nav />}
            <div className="main-navbar-helper">
            <Routes>
                <Route path="/signin" element={<SignIn setEmail = {setEmail} />}/>
                <Route path="/signup" element={<SignUp setEmail = {setEmail} />}/>
                <Route path="/signin/otp" element={<OTPForm email = {email} link={"/acc-verify"}/>}/>
                <Route path="/signup/otp" element={<OTPForm email = {email} link={"/acc-create"}/>}/>
                <Route path="/blogs" element={<Blog/>}/>
                <Route path="/" element={<Home email = {email}/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path = "/contactus" element={<ContactUs footerEmail = {footerEmail} setFooterEmail={setFooterEmail} selectOption={selectOption} setOption = {setOption}/>}/>
                <Route path="/dashboard/*" element={<DashboardAuthProvider><Dashboard/></DashboardAuthProvider>}/>
                <Route path="/chat" element={<ChatProtection><Chat/></ChatProtection>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
            {!hidePathBoolean && <Footer setOption = {setOption} setFooterEmail = {setFooterEmail}/>}
       </div>
               </div>
               </ChatAuthProvider>
    );
}