import axios from "axios"

// baseURL : "http://localhost:8000/",
export default function useAxios(){
    return axios.create({
        baseURL: "https://api.yappyyap.xyz",
        withCredentials: true,
    })
}