import axiosInstance from "./axiosInstance";

export const getCourse = async () => {
  try {
    const response = await axiosInstance.get("/course/");
    return response.data;
  } catch (error) {
    throw error;
  }
};
