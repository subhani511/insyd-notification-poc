import axios from "axios";

const API_BASE = "http://localhost:5000"; // 👈 Change if deploying to Render

const api = axios.create({
  baseURL: API_BASE,
});

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


export const createUser = async (data) => {
  const res = await api.post("/users", data);
  return res.data;
};

export const followUser = async (data) => {
  const res = await api.post("/users/follow", data);
  return res.data;
};

export const postContent = async (data) => {
  const res = await api.post("/content", data);
  return res; // 👈 return full response (so ContentForm can use response.data)
};

export const fetchUsers = async () => {
  const res = await api.get("/users");
  return res.data; // ✅ return the actual data
};

export const fetchPosts = async () => {
  const res = await api.get("/posts");
  return res.data; // ✅ return posts array with populated author name
};


export const fetchNotifications = async (userId) => {
  const res = await api.get(`/notifications/${userId}`);
  return res.data;
};
