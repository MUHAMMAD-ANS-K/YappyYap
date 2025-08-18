import { useContext, createContext, useState, useEffect } from "react";
import useAxios from "./useAxios";
const ChatAuth = createContext()
export default function useChatAuth() {
    return useContext(ChatAuth)
}
export function ChatAuthProvider({children}){
    const [logged, setLogged] = useState(false);
    const [username, setUsername] = useState("")
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        async function makereq() {
            const axios = useAxios();
            try{
                const response = await axios.get("/logincheck");
                if (response.data.msg == "Success") {
                    setLogged(true)
                    setUsername(response.data.username);
                }
            }
            catch{}
            finally{
                setLoading(false);
            }
        }
        makereq();

    },[])
    return(
        <ChatAuth.Provider value={{logged, username, loading, setLogged, setUsername}}>
            {children}
        </ChatAuth.Provider>
    )
}