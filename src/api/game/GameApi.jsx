import * as ApiService from '../Api.service'

export const getCypherInfo = async (params) => {
    return ApiService.get('/api/game/cyphers', params)
}

export const getDnfInfo = async (params) => {
    return ApiService.get('/api/game/dnf', params)
}

export const mergeFavorites = async (params) => {
    return ApiService.post('/api/game/favorites', {params})
}