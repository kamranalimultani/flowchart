/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import axios, { type AxiosResponse } from "axios";

// Base URL for your API
const BASE_URL = import.meta.env.VITE_API_URL; // Fallback URL if the environment variable is not set

// Utility function to get the token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem("token"); // Ensure this is the correct way you store the token
};

// Function to make a GET request
export const getRequest = async (endpoint: string) => {
  try {
    // const token = getToken();

    // if (!token) {
    //   console.error("Token is missing. Please log in.");
    //   throw new Error("Authorization token is missing.");
    // }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: AxiosResponse<any, any> = await axios.get(
      `${BASE_URL}${endpoint}`
      // {
      //   headers: {
      //     Authorization: `Bearer ${token}`, // Pass the token in the header
      //   },
      // }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to make a POST request
export const postRequest = async (endpoint: string, data: any) => {
  try {
    // const token = getToken();
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      // headers: {
      //   Authorization: `Bearer ${token}`, // Pass the token in the header
      // },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Function to make a PUT request
export const putRequest = async (endpoint: string, data: any) => {
  try {
    const token = getToken();
    const response = await axios.put(`${BASE_URL}${endpoint}`, data, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the header
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Function to make a PATCH request
export const patchRequest = async (endpoint: string, data: any) => {
  try {
    const token = getToken();
    const response = await axios.patch(`${BASE_URL}${endpoint}`, data, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the header
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Function to make a DELETE request
export const deleteRequest = async (endpoint: string) => {
  try {
    const token = getToken();
    const response = await axios.delete(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the header
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
