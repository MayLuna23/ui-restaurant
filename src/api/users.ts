import { API_URL } from "./index";
import axios from "axios";

type User = {
  name: string;
  email: string;
  role: string;
  password: string;
};

type FetchUsersResponse = {
  success: boolean;
  data?: any;
  error?: string;
  status?: number;
};

export const fetchUsers = async (jwt: string): Promise<FetchUsersResponse> => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error fetching users:", error);

    return {
      success: false,
      error: error.response?.data?.message || "Unknown error",
      status: error.response?.status || 500,
    };
  }
};

export const createUser = async (user: User, jwt: string): Promise<FetchUsersResponse> => {
  try {
    const response = await axios.post(`${API_URL}/users`, user, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    return {
      success: false,
      error: error.response?.data?.message || "Unknown error",
      status: error.response?.status || 500,
    };
  }
}