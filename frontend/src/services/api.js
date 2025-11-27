import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const seatsAPI = {
  getSeats: (date) => api.get(`/seats${date ? `?date=${date}` : ''}`),
  getAllSeatsForAdmin: () => api.get('/seats/admin/all'),
  createSeat: (seatData) => api.post('/seats', seatData),
  updateSeat: (id, seatData) => api.put(`/seats/${id}`, seatData),
  deleteSeat: (id) => api.delete(`/seats/${id}`),
};

export const reservationsAPI = {
  createReservation: (reservationData) => api.post('/reservations', reservationData),
  getMyReservations: () => api.get('/reservations/my'),
  getAllReservations: (filters) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/reservations/all${params ? `?${params}` : ''}`);
  },
  cancelReservation: (id) => api.put(`/reservations/${id}/cancel`),
  updateReservationStatuses: () => api.post('/reservations/update-statuses'), // New function
};

// Health check function
export const healthAPI = {
  getStatus: () => api.get('/health'),
};

export default api;