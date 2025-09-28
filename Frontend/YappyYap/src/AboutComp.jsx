import "./AboutComp.css"
export default function AboutComp(props) {
    return(
        <div className="about-comp">
            <div className="line-fill">
                <div className="vr-circle-container">
                <span className="vr-circle-fill"></span>
                </div>
                <div className="vr-container">
                <span className="vr-fill"></span>
                <span className="vr"/>
                </div>
            </div>
            <div className="about-comp-content" style = {props.left? {left : "52vw"} : {}}>
            {/* <h2>{props.heading}</h2> */}
            <p>{props.content}</p>
            </div>
        </div>
    );
}