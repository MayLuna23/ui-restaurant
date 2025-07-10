import type { ApiResponse } from "@/types";
import { API_URL } from "./index";
import axios from "axios";

export const fetchOrdersReq = async (
  jwt: string,
  isAdmin: boolean
): Promise<ApiResponse> => {
  try {
    let response;
    if (isAdmin) {
      response = await axios.get(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
    } else {
      response = await axios.get(`${API_URL}/orders/user`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Unknown error",
      status: error.response?.status || 500,
    };
  }
};

export const createOrder = async (
  order: any,
  jwt: string
): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${API_URL}/orders`, order, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Unknown error",
      status: error.response?.status || 500,
    };
  }
};

export const deleteOrder = async (orderId: number, jwt: string): Promise<ApiResponse> => {
  try {
    const response = await axios.delete(`${API_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      });
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error deleting order:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Unknown error",
      status: error.response?.status || 500,
    };
  }
}

export const filterOrdersReq = async (
  filters: any,
  jwt: string
): Promise<ApiResponse> => {
  try {
    console.log(filters)
    const response = await axios.post(`${API_URL}/orders/filter`, filters, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error filtering orders:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Unknown error",
      status: error.response?.status || 500,
    };
  }
};
