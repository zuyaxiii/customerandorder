import axios from "axios";
import axiosInstance from "./api/axiosInstance";

export interface LoginResponse {
  access_token: string;
}

interface ErrorResponse {
  message?: string;
}

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError<ErrorResponse>(error)) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw new Error('An unexpected error occurred');
  }
};
