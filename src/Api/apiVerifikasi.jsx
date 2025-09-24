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

// Ambil seluruh data verifikasi berdasarkan bidang
export const GetVerifikasiByBidang = async () => {
  try {
    const response = await useAxios.get("/veribid", {
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

export const GetRekapTahunan = async (tahun) => {
  try {
    const response = await useAxios.post(
      "/rekap-tahunan",
      {
        tahun: tahun, // bisa dikosongin kalau mau tahun sekarang
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data; // langsung return semua response JSON
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const GetRekapSuper = async (tahun) => {
  try {
    const response = await useAxios.post(
      "/rekap-super",
      {
        tahun: tahun,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data; // langsung return semua response JSON
  } catch (error) {
    throw error.response?.data || error;
  }
};
// Kirim data verifikasi (store)
export const PostVerifikasi = async () => {
  try {
    const response = await useAxios.post(
      "/verifikasi",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    // Tetap lempar respons error backend agar bisa ditangani di frontend
    throw error.response?.data || { message: "Unknown error" };
  }
};

// Verifikasi oleh KABID
export const SetVerifKabid = async (id) => {
  try {
    const response = await useAxios.put(
      `/verif-kabid/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Unknown error" };
  }
};

// Verifikasi oleh SEKRETARIAT
export const SetVerifSekre = async (id) => {
  try {
    const response = await useAxios.put(
      `/verif-sekre/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Unknown error" };
  }
};

// Verifikasi oleh PPTK
export const SetVerifPptk = async (id) => {
  try {
    const response = await useAxios.put(
      `/verif-pptk/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Unknown error" };
  }
};

export const GetDataProses = async () => {
  try {
    const response = await useAxios.get("/verif-kabid", {
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

export const GetDataKabid = async () => {
  try {
    const response = await useAxios.get("/verif-sekre", {
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

export const GetDataSekre = async () => {
  try {
    const response = await useAxios.get("/verif-pptk", {
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
