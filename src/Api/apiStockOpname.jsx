import useAxios from ".";

// Ambil seluruh data stock
export const GetAllStock = async () => {
  try {
    const response = await useAxios.get("/stock", {
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

// Tambah data stock baru
export const CreateStock = async (value) => {
  try {
    const formData = new FormData();

    for (const key in value) {
      formData.append(key, value[key]);
    }

    const response = await useAxios.post("/stock", formData, {
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

// Ambil detail stock berdasarkan ID
export const GetStockById = async (id) => {
  try {
    const response = await useAxios.get(`/stock/${id}`, {
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

// Update data stock
export const UpdateStock = async (id, value) => {
  try {
    const response = await useAxios.put(`/stock/${id}`, value, {
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

// Hapus data stock
export const DeleteStock = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const response = await useAxios.delete(`/stock/${id}`, {
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

export const SearchStock = async (query) => {
  try {
    const response = await useAxios.post(
      "/stock/search",
      { query },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
