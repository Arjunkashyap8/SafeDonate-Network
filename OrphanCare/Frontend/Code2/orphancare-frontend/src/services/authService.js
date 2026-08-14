import api from '../api'


export const register = (payload) => api.post('/auth/register/', payload)
export const verifyOtp = (payload) => api.post('/auth/verify-otp/', payload)
export const login = (payload) => api.post('/auth/login/', payload)
export const logout = () => {
localStorage.removeItem('token')
localStorage.removeItem('user')
}