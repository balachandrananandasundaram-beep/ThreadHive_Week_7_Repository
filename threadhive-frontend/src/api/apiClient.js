import axios from "axios";

const API_BASE_URL = "http://localhost:3000";
// const API_BASE_URL = "https://w04-mls.onrender.com/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach auth token from localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

// Response interceptor — unwrap the axios envelope so callers get the HTTP body
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export const fetchAPI = (endpoint, options = {}) => {
  const { method = "GET", body, headers } = options;
  return apiClient.request({
    url: endpoint,
    method,
    data: body ? (typeof body === "string" ? JSON.parse(body) : body) : undefined,
    headers,
  });
};

export default fetchAPI;
