import useAxios from ".";

// Ambil seluruh data permintaan
export const GetAlldata = async () => {
  try {
    const response = await useAxios.get("/verifikasi", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};