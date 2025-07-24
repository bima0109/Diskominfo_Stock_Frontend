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
export const UpdatePermintaan = async (id, value) => {
  try {
    const response = await useAxios.put(`/permintaan/${id}`, value, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response?.data || error;
  }
};

// Hapus data permintaan
export const DeletePermintaan = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const response = await useAxios.delete(`/permintaan/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
