import axios from "axios";

const API = "http://localhost:5000";

export const forgotPassword = async (email: string) => {
  try {
    console.log("📤 Sending request...");

    const res = await axios.post(
      `${API}/api/auth/forgot-password`,
      { email }
    );

    console.log("✅ Response:", res.data);
    return res.data;

  } catch (error: any) {
    console.error("❌ Error:", error.response?.data || error.message);
    throw error;
  }
};