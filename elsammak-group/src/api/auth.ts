import axios from "axios";

const API = "https://elsammak-group-production.up.railway.app";

const api = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json"
  }
});

// 🔐 LOGIN
export const login = async (data: any) => {
  const res = await api.post("/api/auth/login", data);
  return res.data;
};

// 📝 REGISTER
export const register = async (data: any) => {
  const res = await api.post("/api/auth/register", data);
  return res.data;
};

// 🔢 VERIFY OTP
export const verifyOTP = async (data: any) => {
  const res = await api.post("/api/auth/verify-otp", data);
  return res.data;
};

// 🔑 FORGOT PASSWORD
export const forgotPassword = async (email: string) => {
  const res = await api.post("/api/auth/forgot-password", { email });
  return res.data;
};

// 👤 GET USER
export const getMe = async () => {
  const res = await api.get("/api/auth/me");
  return res.data;
};