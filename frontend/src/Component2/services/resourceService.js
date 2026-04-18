import api from "../../utils/axiosInstance"

const resourceService = {
  getAll:    ()        => api.get("/api/resources"),
  getById:   (id)      => api.get(`/api/resources/${id}`),
  create:    (data)    => api.post("/api/resources", data),
  update:    (id,data) => api.put(`/api/resources/${id}`, data),
  delete:    (id)      => api.delete(`/api/resources/${id}`),
};

export default resourceService;