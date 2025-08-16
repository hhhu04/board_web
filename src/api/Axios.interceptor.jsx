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
            config.headers['Authorization'] = `${accessToken}`;
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

            console.log(`[ Axios.interceptor ] :: response [${config.method}] ${config.url}`);

            if( response.status === 401)
            {
                console.log('[ Axios.interceptor ] :: ERR :: [401]');


                if ( processAwait == null)
                {
                    processAwait = 'temp'

                    let refreshTokenParams = null;
                    let config = response.config;
                    let headers = config.headers;

                    headers['Authorization'] = `${getRefreshToken()}`;
                    refreshTokenParams = { accessToken: getAccessToken(), refreshToken: getRefreshToken() };

                    try {
                        processAwait = axios.create({ headers }).post("/reissue", refreshTokenParams);

                        await processAwait.then( ( {status, data}) => {

                            if (status == 200)
                            {
                                console.log('[ Axios.interceptor ] :: ERR :: [/reissue] : GET NEW TOKEN');

                                // 토큰 세팅
                                const newAccessToken = data.object.accessToken;
                                const newRefreshToken = data.object.refreshToken;

                                setAccessToken(newAccessToken);
                                setRefreshToken(newRefreshToken);

                                console.log('[ Axios.interceptor ] :: ERR :: [/reissue] : 엑세스 토큰 갱신');
                                processAwait = null;

                                headers['Authorization'] = getAccessToken();
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
                            else
                            {
                                //토큰재발급 애러 :  토큰 삭제 후 로그인 페이지
                                processAwait = null;
                                removeAuthTokens()
                                location.href = '/login';
                                Promise.resolve(response);
                            }
                        })
                    }
                    catch(e)
                    {
                        //토큰재발급 애러 :  토큰 삭제 후 로그인 페이지
                        removeAuthTokens()
                        location.href = '/login';
                        return Promise.reject(e)
                    }
                }
                else
                {
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
            else if(response.status === 500)
            {
                return Promise.resolve(response);
            }

        });
}