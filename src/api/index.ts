import axios from "axios"

const $http = axios.create({
    baseURL: './',
    timeout: 5000,
    // headers: {'Authorization': 'none'}
})

export default $http
