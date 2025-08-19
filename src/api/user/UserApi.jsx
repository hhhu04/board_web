import * as ApiService from '../Api.service'

export const loginApi = async (params) => {
    console.log('test.login')

    return ApiService.login(params);
}

export const logoutApi = async (token) => {
    return ApiService.logout({refreshToken: token})
}

export const getUserInfo = async () => {
    return ApiService.get('/api/user/info')
}