import {UserStore} from "../store/UserStore.jsx";
import {getCookie, removeCookie, setCookie} from "./CookieHelper.jsx";

const accessTokenCookieKey = '__ACCESS_TOKEN';
const refreshTokenCookieKey = '__REFRESH_TOKEN';

export const setAccessToken = token => {
    setCookie(accessTokenCookieKey, token);
}

export const getAccessToken = () => {
    return getCookie(accessTokenCookieKey);
}

export const setRefreshToken = token => {
    setCookie(refreshTokenCookieKey, token);
}

export const getRefreshToken = () => {
    return getCookie(refreshTokenCookieKey);
}

export const removeAuthTokens = () => {
    removeCookie(accessTokenCookieKey);
    removeCookie(refreshTokenCookieKey);
    removeCookie('UID');
    UserStore.persist.clearStorage();
}