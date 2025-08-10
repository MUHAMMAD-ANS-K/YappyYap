import axios from "axios"

export default function useAxios(){
    return axios.create({
        baseURL: "https://yappyyap-production.up.railway.app",
        withCredentials: true,
    })
}