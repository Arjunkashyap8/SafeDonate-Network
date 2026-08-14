import api from '../api'


export const createOrphanageProfile = (formData) =>
api.post('/orphanage/profile/', formData, {
headers: { 'Content-Type': 'multipart/form-data' },
})


export const updateOrphanageProfile = (id, formData) =>
api.put(`/orphanage/profile/${id}/`, formData, {
headers: { 'Content-Type': 'multipart/form-data' },
})


export const createRequirement = (formData) =>
api.post('/orphanage/requirements/', formData, {
headers: { 'Content-Type': 'multipart/form-data' },
})


export const listRequirementsByOrphanage = () => api.get('/orphanage/requirements/')


export const listDonations = () => api.get('/orphanage/donations/')


export const updateDonationStatus = (donationId, payload) =>
api.put(`/orphanage/donations/${donationId}/`, payload)