import axios from "axios"

export default function useAxios(){
    // baseURL: "https://api.muhammadans.com",
    return axios.create({
        baseURL : "http://localhost:8000",
        withCredentials: true,
    })
}