import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-refresh token on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('refresh_token')
        const { data } = await axios.post('/api/auth/refresh/', { refresh })
        localStorage.setItem('access_token', data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return api(original)
      } catch {
        localStorage.clear()
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)

// ── Auth ──
export const login = (data) => api.post('/auth/login/', data)
export const logout = (refresh) => api.post('/auth/logout/', { refresh })
export const getMe = () => api.get('/auth/me/')

// ── Leads ──
export const getLeads = (params) => api.get('/leads/', { params })
export const createLead = (data) => api.post('/leads/', data)
export const updateLead = (id, data) => api.patch(`/leads/${id}/`, data)
export const deleteLead = (id) => api.delete(`/leads/${id}/`)
export const assignLead = (id, data) => api.post(`/leads/${id}/assign/`, data)
export const toggleAI = (id) => api.post(`/leads/${id}/toggle-ai/`)

// ── Messages ──
export const getMessages = (leadId) => api.get(`/leads/${leadId}/messages/`)
export const sendMessage = (leadId, data) => api.post(`/leads/${leadId}/send/`, data)

// ── Settings ──
export const getSettings = () => api.get('/settings/')
export const saveSetting = (data) => api.post('/settings/', data)

// ── WhatsApp ──
export const getWAStatus = () => api.get('/wa/status/')
export const getQRCode = () => api.get('/wa/qr/')
export const disconnectWA = () => api.post('/wa/disconnect/')

export default api
