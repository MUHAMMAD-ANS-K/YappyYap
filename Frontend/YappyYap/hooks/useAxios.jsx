import axios from "axios"

export default function useAxios(){
    // baseURL : "http://localhost:8000/",
    return axios.create({
        baseURL: "https://api.muhammadans.com",
        withCredentials: true,
    })
}