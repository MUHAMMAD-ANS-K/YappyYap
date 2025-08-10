import {useState} from "react"
import { useNavigate } from "react-router-dom"
import useAxios from "./hooks/useAxios"
import "./SignIn.css"

export default function SignIn(props) {
    const [email, setEmail] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    async function sendOtp(e){
        setLoading(true);
        e.preventDefault()
        const axios = useAxios();
        try{
            const resp = await axios.post("/signin", {
                email: email
            })
            if (resp.data.message == "Success"){
                props.setEmail(email);
                props.setOtpSent(true);
                navigate("otp");
            }
            else{
                setErr(resp.data.message)
            }
        }
        catch(exception){
            console.log(exception)
            if (exception.response && exception.response.data){
                setErr(exception.response.data.detail[0].msg);
            }
            else
                setErr("Something went wrong. Try Again");
        }
        finally{
            setLoading(false);
        }
    }
    return (
        <form onSubmit={sendOtp} className="background_signin">
            <div className="signin-up">
                <h2 className="signin-up-heading">Sign In</h2>
                <p className="signin-up-p">Don't have an account. <a className="signin-up-a" href="/signup">Sign Up</a></p>
                <hr />
            </div>
        <ul>
            <li>
                <label>
                    Enter your email
                </label>
                <div className="input">                    
                <input className="email-input"type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
        </li>

        <li>
        <button className="sign-button" type="submit" disabled={loading} >{loading ? "Sending...":"Send OTP"}</button></li>
        {err && (<li><p>{err}</p></li>)}
        </ul>
        </form>
    )
}