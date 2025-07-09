import { API_URL } from "./index";
import axios from "axios";

type Login = {
  email: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
  data?: any;
  error?: string;
  status?: number;
};

export const loginRequest = async (loginData: Login): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, loginData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error during login:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Unknown error",
      status: error.response?.status || 500,
    };
  }
};

export const verifyAuthReq = async (jwt: string): Promise<LoginResponse> => {
  try {
    const response = await axios.get(`${API_URL}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error during auth verification:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Unknown error",
      status: error.response?.status || 500,
    };
  }
}