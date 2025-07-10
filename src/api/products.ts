import type { ApiResponse } from "@/types";
import { API_URL } from "./index";
import axios from "axios";

type Product = {
  name: string;
  price: number;
};

export const fetchProductsReq = async (jwt: string): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error fetching products:", error);

    return {
      success: false,
      error: error.response?.data?.message || "Unknown error",
      status: error.response?.status || 500,
    };
  }
};

export const createProduct = async (product: Product, jwt: string): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${API_URL}/products`, product, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error creating product:", error);

    return {
      success: false,
      error: error.response?.data?.message || "Unknown error",
      status: error.response?.status || 500,
    };
  }
};