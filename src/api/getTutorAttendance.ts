import axiosInstance from "./axiosInstance";

const getTutorAttendance = async (tutorId?: number) => {
  try {
    const url = tutorId
      ? `/tutor-attendance/?tutor=${tutorId}`
      : `/tutor-attendance/`;

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getTutorAttendance;
