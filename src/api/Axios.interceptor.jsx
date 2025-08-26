import axios from "axios";
import {
    getAccessToken,
    getRefreshToken,
    removeAuthTokens,
    setAccessToken,
    setRefreshToken
} from "../helpers/AuthHelper.jsx";


axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL
axios.defaults.headers.post['Content-Type'] = 'application/json';


let processAwait = null;
export const init = async () => {
        //console.log("===> Axios.interceptor::init()")
        axios.interceptors.request.use((config) => {

            const accessToken = getAccessToken();

            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            config.headers['Channel'] = 'WEB';

            config.headers['X-Requested-With'] = 'XMLHttpRequest';
            config.headers['Access-Control-Allow-Credentials'] = true;
            config.headers['Access-Control-Allow-Origin'] = '*';
            config.headers['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE, OPTIONS';
            config.headers['Cache-Control'] = 'no-cache';
            config.headers['Pragma'] = 'no-cache';

            console.log('[ Axios.interceptor ] :: processAwait ' + processAwait);

            return config;
        }, err => {
            console.error(err);
            Promise.reject(err);
        });

        axios.interceptors.response.use(
            response => {
                //console.log('[ Axios.interceptor ] :: response OK');
                return response;
            },async err => {
                const config = err.config;          // 기존에 수행하려고 했던 작업
                const response = err.response;

                if( response.status === 401)
                {
                    console.log('[ Axios.interceptor ] :: ERR :: [401]');

                    if( response.data.object === -1001) {

                        if (processAwait == null) {
                            processAwait = 'temp'

                            let refreshTokenParams = null;
                            let config = response.config;
                            let headers = config.headers;

                            headers['Authorization'] = `${getRefreshToken()}`;
                            refreshTokenParams = {refreshToken: getRefreshToken()};

                            try {
                                const authBaseURL = import.meta.env.VITE_AUTH_URL;
                                processAwait = axios.create({
                                    baseURL: authBaseURL,
                                    headers
                                }).post("/refresh", refreshTokenParams);

                                const result = await processAwait;
                                const {status, data} = result;

                                if (status == 200) {
                                    console.log('[ Axios.interceptor ] :: ERR :: [/refresh] : GET NEW TOKEN');

                                    // 토큰 세팅
                                    const newAccessToken = data.token;
                                    const newRefreshToken = data.refreshToken;

                                    setAccessToken(newAccessToken);
                                    setRefreshToken(newRefreshToken);

                                    console.log('[ Axios.interceptor ] :: ERR :: [/refresh] : 엑세스 토큰 갱신');

                                    config.headers.Authorization = `Bearer ${getAccessToken()}`;

                                    processAwait = null;

                                    return axios(config);

                                } else {
                                    //토큰재발급 애러 :  토큰 삭제 후 로그인 페이지
                                    processAwait = null;
                                    removeAuthTokens()
                                    location.href = '/login';
                                    return Promise.reject(result);
                                }
                            } catch (e) {
                                //토큰재발급 애러 :  토큰 삭제 후 로그인 페이지
                                removeAuthTokens()
                                location.href = '/login';
                                return Promise.reject(e)
                            }
                        } else {
                            await processAwait

                            let config = response.config;
                            let headers = config.headers;

                            config.headers['Authorization'] = getAccessToken();
                            const retryAxios = axios.create({headers});

                            if (config.method === 'get') {
                                return retryAxios.get(config.url)
                            } else if (config.method === 'post') {
                                return retryAxios.post(config.url, config.data);
                            } else if (config.method === 'patch') {
                                return retryAxios.patch(config.url, config.data);
                            } else if (config.method === 'put') {
                                return retryAxios.put(config.url, config.data);
                            } else if (config.method === 'delete') {
                                return retryAxios.delete(config.url, {data: config.data});
                            }
                        }
                    }
                    else if(response.data.object === -1002)
                    {
                        console.log('[ Axios.interceptor ] :: ERR :: [-1002] : WRONG TOKEN -> go login');
                        removeAuthTokens();
                        location.href = '/';
                    }
                    else
                    {
                        console.log('else')
                        return Promise.resolve(response);
                    }

                }
                else if(response.status === 500)
                {
                    return Promise.resolve(response);
                }
                else
                {
                    return Promise.reject(err);
                }

            });
}