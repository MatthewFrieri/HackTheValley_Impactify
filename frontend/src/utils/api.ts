import axios from 'axios';

const api = axios.create({
    // Digital Ocean Droplet IP
    baseURL: "45.55.125.88",
});

export default api;