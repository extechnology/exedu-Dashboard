import axiosInstance from "./axiosInstance";

const getRegion = async () => {
   try {
    const response = await axiosInstance.get("/region/")
    return response.data
   } catch (err) {
    throw err
   }
}

export default getRegion