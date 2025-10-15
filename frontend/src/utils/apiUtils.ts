// src/utils/apiUtils.ts
import axios, { AxiosError, type AxiosResponse } from "axios";

export const BASE_URL = import.meta.env.VITE_API_URL;

// Type definitions
interface ApiSuccessResponse<T = any> {
  success: true;
  message: string;
  data?: T;
  [key: string]: any;
}

interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
  error_code?: string;
}

type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// Custom API Error class
export class ApiError extends Error {
  statusCode: number;
  errorCode?: string;
  errors?: Record<string, string[]>;
  response?: any;

  constructor(
    message: string,
    statusCode: number,
    errorCode?: string,
    errors?: Record<string, string[]>,
    response?: any
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
    this.response = response;
  }
}

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

// Generic request function with error handling
const request = async <T = any>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  endpoint: string,
  data?: any,
  useAuth = false
): Promise<T> => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (useAuth) {
      const token = getToken();
      if (!token) {
        throw new ApiError(
          "Authorization token is missing. Please login again.",
          401,
          "NO_TOKEN"
        );
      }
      headers.Authorization = `Bearer ${token}`;
    }

    const config: any = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers,
      data,
    };

    // For GET/DELETE, Axios ignores the data property
    if (method === "GET" || method === "DELETE") {
      delete config.data;
    }

    const response: AxiosResponse<T> = await axios(config);
    return response.data;
  } catch (error) {
    // Handle Axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;

      if (axiosError.response) {
        // Server responded with error status
        const errorData = axiosError.response.data;
        const statusCode = axiosError.response.status;

        throw new ApiError(
          errorData?.message || getDefaultErrorMessage(statusCode),
          statusCode,
          errorData?.error_code,
          errorData?.errors,
          axiosError.response
        );
      } else if (axiosError.request) {
        // Request made but no response received
        throw new ApiError(
          "Network error. Please check your internet connection.",
          0,
          "NETWORK_ERROR"
        );
      } else {
        // Something else happened
        throw new ApiError(
          axiosError.message || "An unexpected error occurred",
          0,
          "UNKNOWN_ERROR"
        );
      }
    }

    // Non-Axios error
    throw new ApiError(
      error instanceof Error ? error.message : "An unexpected error occurred",
      0,
      "UNKNOWN_ERROR"
    );
  }
};

// Helper function to get default error messages
const getDefaultErrorMessage = (statusCode: number): string => {
  switch (statusCode) {
    case 400:
      return "Bad request. Please check your input.";
    case 401:
      return "Unauthorized. Please login again.";
    case 403:
      return "Forbidden. You don't have permission to access this resource.";
    case 404:
      return "Resource not found.";
    case 409:
      return "Conflict. The resource already exists.";
    case 422:
      return "Validation failed. Please check your input.";
    case 429:
      return "Too many requests. Please try again later.";
    case 500:
      return "Server error. Please try again later.";
    case 503:
      return "Service unavailable. Please try again later.";
    default:
      return "An error occurred. Please try again.";
  }
};

// Specific method helpers with proper typing
export const getRequest = <T = any>(
  endpoint: string,
  useAuth = false
): Promise<T> => request<T>("GET", endpoint, undefined, useAuth);

export const postRequest = <T = any>(
  endpoint: string,
  data?: any,
  useAuth = false
): Promise<T> => request<T>("POST", endpoint, data, useAuth);

export const putRequest = <T = any>(
  endpoint: string,
  data: any,
  useAuth = false
): Promise<T> => request<T>("PUT", endpoint, data, useAuth);

export const patchRequest = <T = any>(
  endpoint: string,
  data: any,
  useAuth = false
): Promise<T> => request<T>("PATCH", endpoint, data, useAuth);

export const deleteRequest = <T = any>(
  endpoint: string,
  useAuth = false
): Promise<T> => request<T>("DELETE", endpoint, undefined, useAuth);

// Helper function to format validation errors
export const formatValidationErrors = (
  errors?: Record<string, string[]>
): Record<string, string> => {
  if (!errors) return {};

  const formattedErrors: Record<string, string> = {};
  Object.entries(errors).forEach(([field, messages]) => {
    formattedErrors[field] = messages[0]; // Take first error message
  });

  return formattedErrors;
};

export default {
  getRequest,
  postRequest,
  putRequest,
  patchRequest,
  deleteRequest,
  ApiError,
  formatValidationErrors,
};
