import * as ApiService from '../Api.service'

export const loginApi = async (params) => {
    console.log('test.login')

    return ApiService.login(params);
}