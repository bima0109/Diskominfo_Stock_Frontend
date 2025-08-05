import useAxios from ".";

export const GetAllCart = async () => {
  try {
    const response = await useAxios.get("/cart", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    console.log("API Response:", response.data); // Tambahkan debug
    return response.data.data; // ⬅️ ini penting
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const AddtoCart = async (value) => {
  try {
    const response = await useAxios.post("/cart", value, {
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

export const UpdateCart = async (id, value) => {
  try {
    const response = await useAxios.put(`/cart/${id}`, value, {
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

export const DeleteCart = async (id) => {
  try {
    const response = await useAxios.delete(`/cart/${id}`, {
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
