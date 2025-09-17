import axiosInstance from "./axiosInstance";

const getEnquiry = async () => {
    try {
        const response = await axiosInstance.get("/enroll-form/");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default getEnquiry