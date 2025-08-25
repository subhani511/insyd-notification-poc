import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Axios interceptor for logging responses/errors
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

// Create a new user
export const createUser = async (data) => {
  const res = await api.post("/users", data);
  return res.data;
};

// Follow or unfollow a user
export const followUser = async (data) => {
  const res = await api.post("/users/follow", data);
  return res.data;
};

// Post content
export const postContent = async (data) => {
  const res = await api.post("/content", data);
  return res; // return full response so ContentForm can use response.data
};

// Fetch all users
export const fetchUsers = async () => {
  const res = await api.get("/users");
  return res.data; // return actual array of users
};

// Fetch all posts
export const fetchPosts = async () => {
  const res = await api.get("/content");
  return res.data; // posts array with populated author name
};

// Fetch notifications for a user
export const fetchNotifications = async (userId) => {
  const res = await api.get(`/notifications/${userId}`);
  return res.data;
};
