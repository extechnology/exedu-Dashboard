import axiosInstance from "./axiosInstance";


export const getStudentProfile = async ()=> {
    try {
        const response = await axiosInstance.get("/profile/");
        return response.data;
    } catch (error) {
        throw error;
    }
}
