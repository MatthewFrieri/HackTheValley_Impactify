import axios from 'axios';

const api = axios.create({
    // Digital Ocean Droplet IP
    baseURL: "http://104.131.48.249:8000",
});

export default api;