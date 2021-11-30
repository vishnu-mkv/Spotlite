import {useEffect, useState} from 'react'
import axios from 'axios';

function UseAuth(code) {

    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [expiresIn, setExpiresIn] = useState(null);

    const url = "https://spotlite-node.herokuapp.com";

    const setData = (data) => {
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setExpiresIn(data.expiresIn);
    }

    useEffect(() => {
        axios.post(`${url}/login`, {code})
            .then(res => {
                setData(res.data);
                window.history.pushState({}, null, '/')
            })
            .catch(() => window.location = '/');
    }, [code]);

    useEffect(() => {
        if (!refreshToken || !expiresIn) return;
        
        const interval = setInterval(() => {
            axios.post(`${url}/login/refresh`, {refreshToken})
                .then(res => setData(res.data))
                .catch(() => window.location = '/');
        }, (expiresIn - 60)*1000);

        return () => clearInterval(interval);
    }, [refreshToken, expiresIn])

    return accessToken;
}

export default UseAuth;
