
import axios from "axios";

const clientesAxios = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`
})

export default clientesAxios