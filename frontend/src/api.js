import axios from "axios";

const API_BASE = "http://192.168.69.58:5000"; 

export const fetchUsers = () => axios.get(`${API_BASE}/users`);
export const createUser = (data) => axios.post(`${API_BASE}/users`, data);
export const followUser = (data) => axios.post(`${API_BASE}/users/follow`, data);
export const postContent = (data) => axios.post(`${API_BASE}/content`, data);
export const getNotifications = (userId) => axios.get(`${API_BASE}/notifications/${userId}`);

