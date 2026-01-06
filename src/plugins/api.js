import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // change to your Laravel API URL
  withCredentials: true, // important for Sanctum / cookies
  withXSRFToken : true,
  headers: {
    'Accept': 'application/json',
  },
})

export default api
