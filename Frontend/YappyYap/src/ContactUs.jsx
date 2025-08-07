import "./ContactUs.css"
import { useRef, useState } from "react"
import { Link } from "react-router-dom"
export default function ContactUs() {
    const emailRef = useRef();
    const [selectOption, setOption] = useState("NewsLetter");
    const issueRef = useRef();
    return(
        <section>
            <ul className="contact-us-nav">
                <li className="home"><Link to="/">Home</Link></li>
                <li className="contact-us"><Link to="/contactus">Contact Us</Link></li>
            </ul>
            <div className="contact-us-container">
                <h2>Contact Us</h2>
                <form onSubmit="">
                    <div className="input">
                        <ul className="ul-contactus">
                        
                    <li>
                        <label htmlFor="select-contact">Reason for Contact</label>
                    <select value={selectOption} onChange={(e)=> setOption(e.target.value)} id="select-contact">
                        <option value="NewsLetter">NewsLetter</option>
                        <option value="BugReport">Bug Report</option>
                        <option value="other">Others</option>
                    </select>
                        </li>
                    <li>
                    {selectOption === "NewsLetter" ? (<input type="email" className="email-input email-contact" placeholder="Enter your email" ref={emailRef}/>): (<textarea type="text"placeholder="Enter your problem here" ref={issueRef} className="text-contact"/>)}
                    </li>

                    <li>
                    <button type="submit" className="sign-button">Submit</button>
                    </li>
                        </ul>
                    </div>

                </form>
            </div>
        </section>
    )
}