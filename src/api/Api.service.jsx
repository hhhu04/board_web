import axios from 'axios';
import {init} from "./Axios.interceptor.jsx";

export const getQueryStringFromObject = (slug = {}) => {
    return '?' + Object.keys(slug).filter(key => (slug[key] != null && slug[key] !== 'null'))
        .map(key => key + '=' + slug[key]).join('&');
}

export const login = async (params) => {
    console.log('=> Api.service:login');

    await init();
    return axios.post(import.meta.env.VITE_AUTH_URL+"/login",params)
        .then(({ status, data }) => {
            return { status, data };
        }).catch(errorHandler);
}

export const logout= async (params) => {
    console.log('=> Api.service:login');

    await init();
    return axios.post(import.meta.env.VITE_AUTH_URL+"/logout",params)
        .then(({ status, data }) => {
            return { status, data };
        }).catch(errorHandler);
}

export const get = async (url, slug = {}) => {
    console.log('=> Api.service:get');

    await init();
    const params = getQueryStringFromObject(slug);

    return axios.get(url + params)
        .then(({ status, data }) => {
            if (status === 200) {
                return data;
            }
        }).catch(errorHandler);
}

export const post = async (url, params) => {
    console.log('=> Api.service:post');

    await init();
    return axios.post(url, params)
        .then(({ status, data }) => {
            return { status, data };
        }).catch(errorHandler);
}

export const put = async (url, params) => {
    console.log('Api.service:put');

    await init();
    return axios.put(url, params)
        .then(({ status, data }) => {
            return { status, data };
        }).catch(errorHandler);
}

export const patch = async (url, params) => {
    console.log('Api.service:put');

    await init();
    return axios.patch(url, params)
        .then(({ status, data }) => {
            return { status, data };
        }).catch(errorHandler);
}

export const remove = async (url, params = {}) => {
    console.log('Api.service:remove');

    await init();
    return axios.delete(url, {data: params})
        .then(({ status, data }) => {
            return { status, data };
        }).catch(errorHandler);
}

const errorHandler = ({ response }) => {
    console.log('errorHandler : ' + response)
   return response;
}