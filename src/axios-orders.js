import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "https://react-my-burger-79415.firebaseio.com/"
})

export default axiosInstance