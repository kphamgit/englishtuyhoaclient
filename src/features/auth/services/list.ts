import axios from "axios"
import { useRootUrl } from "../../../contexts/root_url";


type Credentials = {
    username: string
    password: string
}

export async function login(root_url: string, credentials: Credentials) {
    console.log("auth service login root_url = ", root_url)
    if (credentials.username.length === 0) {
        alert("Please enter username")
        return false
    }
    else if (credentials.password.length === 0) {
        alert("please enter password")
        return false
    }
    let url = `${root_url}/sessions`
    const response = await axios.post(url, credentials)
    //response is a promise
    return response.data
}