import axiosInstance from "../axiosInstance";
import type { LoginRequest } from "@/types";

export const loginUser = async (data: LoginRequest) => {
  const response = await axiosInstance.post("/api/token/", {
    username: data.username,
    password: data.password,
  });
  return response.data;
};
