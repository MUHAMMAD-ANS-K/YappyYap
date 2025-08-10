import axios from "axios"

export default function useAxios(){
    return axios.create({
        baseURL: "https://api.muhammadans.com",
        withCredentials: true,
    })
}