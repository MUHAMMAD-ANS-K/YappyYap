import {useState, useEffect, useRef} from "react"
export default function AccActiveMsg(props){
    const [timer, setTimer] = useState(props.expirySeconds)
    const remove = useRef(false)
    const interval = useRef()
    useEffect(()=>{
        interval.current = setInterval(()=>{
            setTimer(t =>{
                if(t > 0)
                    return t - 1;
                remove.current = true;
                return 0;
            });
            if(remove.current){
                const element = document.querySelector(`.active-message-${props.id}`);
                if (element){
                    props.removeYourself(props.id);
                    // element.style.display="none"
                }
                remove.current = false;
                clearInterval(interval.current)
            }
        }, 1000)
        return ()=> clearInterval(interval.current);
    }, [])
    return(
                <div className={`active-message active-message-${props.id}`}>
                    <p className="timestamp-active-msg">{props.time}</p>
                    <p className="active-actual-msg">{props.msg}</p>
                    <div className="active-message-timer">
                        {timer}
                    </div>
                </div>
    )
}