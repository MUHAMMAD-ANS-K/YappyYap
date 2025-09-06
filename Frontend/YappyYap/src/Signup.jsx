import {useState} from "react"
import { useNavigate } from "react-router-dom"
import "./SignIn.css"
import useAxios from "../hooks/useAxios";

export default function SignUp(props) {
    const [email, setEmail] = useState("");
    const [username, setusername] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    async function sendOtp(e){
        setLoading(true);
        e.preventDefault();
        const axios = useAxios();
        try{
            const resp = await axios.post("/signup", {
                email: email,
                username: username
            })
            if (resp.data.msg == "Success"){
                props.setEmail(email);
                navigate("otp");
            }
        }
        catch(exception){
            if (exception.response && exception.response.data) {
                setErr(exception.response.data.detail[0].msg);
            }
            else{
                setErr("Something went wrong. Try Again")
            }
        }
        finally{
            setLoading(false);
        }
    }
    return (
        <form onSubmit={sendOtp} className="background_signin">
            <div className="signin-up">
                <h2 className="signin-up-heading">Sign Up</h2>
                <p className="signin-up-p">Already have an account. <a className="signin-up-a" href="/signin">Sign In</a></p>
                <hr />
            </div>
        <ul>
            <li className="margin-10px">
                <label>
                    Username
                </label>
                <div className="input">                    
                <input className="username-input" type="text" placeholder="Username" value={username} onChange={(e) => setusername(e.target.value)} required/>
                </div>
        </li>
            <li>
                <label>
                    Enter your email
                </label>
                <div className="input">                    
                <input className="email-input" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
        </li>

        <li>
        <button className="sign-button" type="submit" disabled={loading} >{loading ? "Sending..." : "Send OTP"}</button></li>
        <li><p>{err}</p></li>
        </ul>
        </form>
    )
}