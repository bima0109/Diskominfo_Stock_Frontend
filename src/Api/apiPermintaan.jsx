import useAxios from ".";

// Ambil seluruh data permintaan
export const GetAllpermintaan = async () => {
  try {
    const response = await useAxios.get("/permintaan", {
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

export const CreatePermintaan = async (value) => {
  try {
    const formData = new FormData();

    for (const key in value) {
      formData.append(key, value[key]);
    }

    const response = await useAxios.post("/permintaan", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response?.data || error;
  }
};
