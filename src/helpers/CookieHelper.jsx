import cookie from 'react-cookies';

export const setCookie = (key, value, expires) => {
    if (!expires) {
        expires = new Date()
        expires.setDate(expires.getDate() + 30);
    }
    const options = {}
    options.expires = expires;
    options.path = '/';
    
    // 보안 설정 추가
    if (window.location.protocol === 'https:') {
        options.secure = true;
    }
    options.sameSite = 'strict';

    if (import.meta.env.VITE_APP_ENV !== 'local') {
        options.domain = `.${import.meta.env.VITE_APP_COOKIE_DOMAIN}`;
    }

    cookie.save(key, value, options);
}

export const getCookie = key => {
    return cookie.load(key)
}

export const removeCookie = key => {
    const options = {}
    options.path = '/';
    if (import.meta.env.VITE_APP_ENV !== 'local') {
        options.domain = `.${import.meta.env.VITE_APP_COOKIE_DOMAIN}`;
    }
    return cookie.remove(key, options)
}