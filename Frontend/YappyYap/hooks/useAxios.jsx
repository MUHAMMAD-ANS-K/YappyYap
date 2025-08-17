import axios from "axios"

export default function useAxios(){
    // baseURL: "https://api.muhammadans.com",
    return axios.create({
        baseURL : "https://api.muhammadans.com",
        withCredentials: true,
    })
}