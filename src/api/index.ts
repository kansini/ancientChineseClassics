import axios from 'axios'

const $http = axios.create({
  baseURL: import.meta.env.BASE_URL,
  timeout: 5000,
  // headers: {'Authorization': 'none'}
})

export default $http
