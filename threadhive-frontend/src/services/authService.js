import fetchAPI from "../api/apiClient.js";
import { AUTH_API } from "../config/apiConfig.js";

export const login = async (credentials) => {
  return await fetchAPI(AUTH_API.LOGIN, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const register = async (formData) => {
  return await fetchAPI(AUTH_API.REGISTER, {
    method: "POST",
    body: JSON.stringify(formData),
  });
};

