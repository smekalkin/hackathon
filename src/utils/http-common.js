import axios from 'axios';
import Storage from './Storage';

let instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Storage.getItem('jwt-token')
    },
    validateStatus: function (status) {
        return status == 200 || status == 201;
    }
});
instance.interceptors.response.use(null, function (error) {
    if (error.response.status === 401) {
        Storage.setItem('jwt-token', null);
    }

    return Promise.reject(error);
});

export default instance;