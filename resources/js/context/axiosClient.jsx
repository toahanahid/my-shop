import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Create axios instance
const axiosClient = axios.create({
  baseURL: "/", // or your API base URL
  withCredentials: true, // important for sanctum
});

// Attach guest ID automatically
axiosClient.interceptors.request.use((config) => {
  let guestId = localStorage.getItem("guest_id");
  if (!guestId) {
    guestId = uuidv4();
    localStorage.setItem("guest_id", guestId);
  }

  config.headers["X-Guest-ID"] = guestId;

  // Attach Bearer Token if user is logged in
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;
