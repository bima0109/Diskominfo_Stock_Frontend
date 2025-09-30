import useAxios from ".";

export const GetAllUsers = async () => {
  try {
    const response = await useAxios.get("/users", {
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

export const GetUsers = async () => {
  try {
    const response = await useAxios.get("/users-master", {
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

// Tambah user baru
export const CreateUser = async (value) => {
  try {
    const formData = new FormData();
    for (const key in value) {
      formData.append(key, value[key]);
    }

    const response = await useAxios.post("/users", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const GetUserByusername = async (username) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await useAxios.post(
      "/users-show",
      { username: username },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Gagal mencari user:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Update user berdasarkan ID
export const UpdateUser = async (id, value) => {
  try {
    const response = await useAxios.put(`/users/${id}`, value, {
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

// Hapus user berdasarkan ID
export const DeleteUser = async (id) => {
  try {
    const response = await useAxios.delete(`/users/${id}`, {
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

// Reset password user ke default (password123)
export const ResetUserPassword = async (id) => {
  try {
    const response = await useAxios.put(`/users-reset/${id}`, null, {
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

export const GetProfile = async () => {
  try {
    const response = await useAxios.get("/profile", {
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

export const UpdateProfile = async (value) => {
  try {
    const formData = new FormData();
    for (const key in value) {
      formData.append(key, value[key]);
    }

    const response = await useAxios.post("/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


export const UpdatePassword = async (value) => {
  try {
    const response = await useAxios.put("/reset", value, {
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

