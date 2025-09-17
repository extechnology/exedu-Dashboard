import axiosInstance from "./axiosInstance";

const getCourseOptions = async () => {
  try {
    const response = await axiosInstance.get("/course-options/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getCourseOptions;
