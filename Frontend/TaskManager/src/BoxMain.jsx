import { useState } from "react";
import "./BoxMain.css"
export default function BoxMain(props) {
    return (
        <div className="main-box">
            <div className="image-box">
            <img src={props.display_stuff} alt="img" />
            </div>
            <div className="content-box">
            <h2>{props.heading}</h2>
            <p>{props.content}</p>
            </div>
        </div>
    );
}