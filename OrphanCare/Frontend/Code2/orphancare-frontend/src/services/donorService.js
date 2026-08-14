import api from '../api'


export const createDonorProfile = (payload) => api.post('/donor/profile/', payload)
export const listRequirements = () => api.get('/donor/requirements/')
export const createDonation = (payload) => api.post('/donor/donations/', payload)
export const listMyDonations = () => api.get('/donor/donations/')