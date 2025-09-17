import axiosInstance from "./axiosInstance";

const getContact = async () => {
    try {
        const response = await axiosInstance.get("/contact/");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default getContact;