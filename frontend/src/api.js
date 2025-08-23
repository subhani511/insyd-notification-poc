import axios from "axios";

const API_BASE = "http://localhost:5000"; // LAN IP

const api = axios.create({
  baseURL: API_BASE,
});

// 🔹 Interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.config?.url, error.message);
    return Promise.reject(error);
  }
);

// ✅ Use `api` instead of plain axios
export const fetchUsers = () => api.get("/users");
export const createUser = (data) => api.post("/users", data);
export const followUser = (data) => api.post("/users/follow", data);
export const postContent = (data) => api.post("/content", data);
export const getNotifications = (userId) => api.get(`/notifications/${userId}`);
