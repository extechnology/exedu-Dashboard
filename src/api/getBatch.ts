import axiosInstance from "./axiosInstance";

const getBatch = async () => {
  try {
    const response = await axiosInstance.get("/batches/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getBatch;
