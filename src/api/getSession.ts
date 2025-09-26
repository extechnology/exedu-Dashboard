import axiosInstance from "./axiosInstance";

const getSession = async () => {
  try {
    const response = await axiosInstance.get("/session/");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default getSession