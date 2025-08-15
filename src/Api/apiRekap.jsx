import useAxios from ".";

export const GetAllMasuk = async () => {
  try {
    const response = await useAxios.get("/masuk", {
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

export const GetAllMasih = async () => {
  try {
    const response = await useAxios.get("/masih", {
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

export const GetAllhabis = async () => {
  try {
    const response = await useAxios.get("/habis", {
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

// Jalankan fungsi habis()
export const PostHabis = async () => {
  try {
    const response = await useAxios.post(
      "/habis",
      {}, // body kosong, karena tidak perlu kirim data
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data; // langsung return semua respons
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Jalankan fungsi masih()
export const PostMasih = async () => {
  try {
    const response = await useAxios.post(
      "/masih",
      {}, // body kosong
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update tanggal barang masih
export const UpdateTanggalMasih = async (id, tanggal) => {
  try {
    const response = await useAxios.put(
      `/masih/${id}`,
      { tanggal }, // format: YYYY-MM-DD
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update tanggal barang habis
export const UpdateTanggalHabis = async (id, tanggal) => {
  try {
    const response = await useAxios.put(
      `/habis/${id}`,
      { tanggal },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update tanggal history masuk
export const UpdateTanggalMasuk = async (id, tanggal) => {
  try {
    const response = await useAxios.put(
      `/masuk/${id}`,
      { tanggal },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

