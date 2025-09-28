/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosResponse } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getToken = (): string | null => {
  const auth = localStorage.getItem("auth");
  if (!auth) return null;
  try {
    const { token } = JSON.parse(auth);
    return token;
  } catch {
    return null;
  }
};

// Generic request function
const request = async (
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  endpoint: string,
  data?: any,
  useAuth = false
) => {
  try {
    const headers: any = {};

    if (useAuth) {
      const token = getToken();
      console.log(token, "sdfsd");
      if (!token) throw new Error("Authorization token is missing");
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers,
      data,
    };

    // For GET/DELETE, Axios ignores the data property
    if (method === "GET" || method === "DELETE") delete config.data;

    const response: AxiosResponse<any, any> = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`${method} request to ${endpoint} failed:`, error);
    throw error;
  }
};

// Specific method helpers
export const getRequest = (endpoint: string, useAuth = false) =>
  request("GET", endpoint, undefined, useAuth);

export const postRequest = (endpoint: string, data: any, useAuth = false) =>
  request("POST", endpoint, data, useAuth);

export const putRequest = (endpoint: string, data: any, useAuth = false) =>
  request("PUT", endpoint, data, useAuth);

export const patchRequest = (endpoint: string, data: any, useAuth = false) =>
  request("PATCH", endpoint, data, useAuth);

export const deleteRequest = (endpoint: string, useAuth = false) =>
  request("DELETE", endpoint, undefined, useAuth);
