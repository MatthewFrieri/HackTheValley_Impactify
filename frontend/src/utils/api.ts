import axios from 'axios';

const api = axios.create({
    // Digital Ocean Droplet IP
    baseURL: "http://localhost:8000",
});

export default api;