import axios from 'axios';
import { SERVER_API } from 'host';
import jwt_decode from 'jwt-decode';

const refreshToken = async () => {
    try {
        const res = await axios.post(
            `${SERVER_API}/auth/refresh`,
            {},
            {
                withCredentials: true
            }
        );
        return res.data;
    } catch (err) {
        console.log(err);
    }
};

export const createAxios = (user) => {
    const newInstance = axios.create({ withCredentials: true });
    newInstance.interceptors.request.use(
        async (config) => {
            const decodedToken = jwt_decode(user?.accessToken);
            if (decodedToken.exp < new Date().getTime() / 1000) {
                const data = await refreshToken();
                const refreshUser = {
                    ...user,
                    accessToken: data.accessToken
                };
                localStorage.setItem('blast-user', JSON.stringify(refreshUser));
                config.headers['Authorization'] = `Bearer ${data.accessToken}`;
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        }
    );
    return newInstance;
};
