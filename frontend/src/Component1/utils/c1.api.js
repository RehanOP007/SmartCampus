import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// ─── USER MANAGEMENT ───────────────────────────────────────────────────────
export const userAPI = {
  getAll:     ()           => api.get("/api/users"),
  getById:    (id)         => api.get(`/api/users/${id}`),
  create:     (data)       => api.post("/api/users", data),
  update:     (id, data)   => api.put(`/api/users/${id}`, data),
  delete:     (id)         => api.delete(`/api/users/${id}`),
  updateRole: (id, role)   => api.put(`/api/users/${id}/role?role=${role}`),
};

// ─── BOOKING MANAGEMENT ────────────────────────────────────────────────────
export const bookingAPI = {
  getAll:        ()           => api.get("/api/bookings"),
  create:        (data)       => api.post("/api/bookings", data),
  approve:       (id)         => api.put(`/api/bookings/${id}/approve`),
  reject:        (id)         => api.put(`/api/bookings/${id}/reject`),
  cancel:        (id)         => api.put(`/api/bookings/${id}/cancel`),
  updateStatus:  (id, status) => api.put(`/api/bookings/${id}/status?status=${status}`),
  getByResource: (id)         => api.get(`/api/bookings/resource/${id}`),
};

// ─── TICKET MANAGEMENT ─────────────────────────────────────────────────────
export const ticketAPI = {
  getAll:       ()                  => api.get("/api/tickets"),
  create:       (data)              => api.post("/api/tickets", data),
  update:       (id, data)          => api.put(`/api/tickets/${id}`, data),
  delete:       (id)                => api.delete(`/api/tickets/${id}`),
  updateStatus: (id, status)        => api.put(`/api/tickets/${id}/status?status=${status}`),
  assignTech:   (id, technicianId)  => api.put(`/api/tickets/${id}/assign?techId=${technicianId}`),
  addComment: (id, comment, userId) =>
  api.post(`/api/tickets/${id}/comments?userId=${userId}`, {
    comment: comment.trim(),
  }),
  uploadAttachment: (id, fileUrl, fileName) =>
  api.post(`/api/tickets/${id}/attachments`, null, {
    params: {
      fileUrl,
      fileName,
    },
  }),
  getAttachments: (id) => api.get(`/api/tickets/${id}/attachments`),
  deleteAttachment: (attachmentId) => api.delete(`/api/attachments/${attachmentId}`),
};