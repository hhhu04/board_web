import * as ApiService from '../Api.service'

export const getCypherInfo = async (params) => {
    return ApiService.get('/api/game/cyphers', params)
}

export const getCyphersMatch = async (params) => {
    return ApiService.get('/api/game/cyphers/match', params)
}

export const getCyphersMatchList = async (param) => {
    return ApiService.get(`/api/game/cyphers/match${param}`)
}

export const getDnfInfo = async (params) => {
    return ApiService.get('/api/game/dnf', params)
}

export const getDnfTimeline = async (params) => {
    return ApiService.get('/api/game/dnf/timeline', params)
}

export const getDnfDetail = async (params) => {
    return ApiService.get('/api/game/dnf/detail', params)
}

export const getLolInfo = async (params) => {
    return ApiService.get('/api/game/lol', params)
}


export const mergeFavorites = async (params) => {
    return ApiService.post('/api/game/favorites', {params})
}