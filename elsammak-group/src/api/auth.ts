import axios from "axios";

const API = "http://localhost:5000";

export const login = async (data: any) => {
  const res = await axios.post(`${API}/api/auth/login`, data);
  return res.data;
};

export const register = async (data: any) => {
  const res = await axios.post(`${API}/api/auth/register`, data);
  return res.data;
};

export const verifyOTP = async (data: any) => {
  const res = await axios.post(`${API}/api/auth/verify-otp`, data);
  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await axios.post(`${API}/api/auth/forgot-password`, { email });
  return res.data;
};

export const getMe = async () => {
  const res = await axios.get(`${API}/api/auth/me`);
  return res.data;
};