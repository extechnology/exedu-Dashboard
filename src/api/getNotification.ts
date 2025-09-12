import axiosInstance from "./axiosInstance";

export const getNotification = async () => {
    try {
        const response = await axiosInstance.get("/notification/");
        return response.data;
    } catch (error) {
        throw error;
    }
};