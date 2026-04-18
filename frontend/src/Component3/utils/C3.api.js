import api from "../../utils/axiosInstance";

export const getAllResources = () => {
    return api.get(`/api/resources`);
}

export const getResourceById = (id) => {
    return api.get(`/api/resources/${id}`);
}

export const createResource = (data) => {
    return api.post(`/api/resources`, data);
}

export const updateResource = (id, data) => {
    return api.put(`/api/resources/${id}`, data);
}

export const deleteResource = (id) => {
    return api.delete(`/api/resources/${id}`);
}

export const createBooking = (data) => {
    return api.post(`/api/bookings`, data);
};

export const getAllBookings = () => {
    return api.get(`/api/bookings`);
};

export const rejectBooking = (id) => {
    return api.put(`/api/bookings/${id}/reject`);
};

export const updateBookingStatus = (id, status) => {
    return api.put(`/api/bookings/${id}/status?status=${status}`);
};

export const cancelBooking = (id) => {
    return api.put(`/api/bookings/${id}/cancel`);
};

export const getBookingsByResource = (resourceId) => {
    return api.get(`/api/bookings/resource/${resourceId}`);
};

export const getBookingById = (id) => {
    return api.get(`/api/bookings/${id}`);
};

export const updateBooking = (id, data) => {
    return api.put(`/api/bookings/${id}`, data);
};


export const createTicket = (data, userId) => {
  return api.post(`/api/tickets?userId=${userId}`, data);
};

export const getAllTickets = () => {
  return api.get("/api/tickets");
};

export const assignTechnician = (ticketId, techId) => {
  return api.put(`/api/tickets/${ticketId}/assign?techId=${techId}`);
};

export const updateTicketStatus = (ticketId, status) => {
  return api.put(`/api/tickets/${ticketId}/status?status=${status}`);
};

export const deleteTicket = (ticketId) => {
  return api.delete(`/api/tickets/${ticketId}`);
}

export const addComment = (ticketId, comment) => {
  return api.post(`/api/tickets/${ticketId}/comments`, { comment });
};

export const uploadAttachment = (ticketId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`/api/tickets/${ticketId}/attachments`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAttachments = (ticketId) => {
  return api.get(`/api/tickets/${ticketId}/attachments`);
};

export const deleteAttachment = (attachmentId) => {
  return api.delete(`/api/attachments/${attachmentId}`);
};