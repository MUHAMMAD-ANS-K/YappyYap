import { useRef, useState } from "react";
import "./Dashboard.css"
export default function Dashboard() {
    const heading = useRef();
    const content = useRef();    
    const [file, setFile] = useState("No file choosen");
    const file_ref = useRef();
    return(
        <main>
            <h1>
                Fill the contents to add a box on the home page.
            </h1>
            <div className="boxmain-add">
                <label htmlFor=""></label>
                <textarea placeholder="Heading" ref={heading} className="heading"></textarea>
                <textarea placeholder="Content" ref={content} className="content"></textarea>
                <label htmlFor="file" className="sign-button" id="file-chose">{file}</label>
                <input type="file" ref={file_ref} onChange={(e)=> setFile(e.target.files[0].name)} id="file"/>
            </div>
        </main>
    );
}