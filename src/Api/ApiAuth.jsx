import useAxios from ".";

const Login = async (username, password) => {
  try {
    const response = await useAxios.post("/login", { username, password });
    return response.data;
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Unknown error" };
  }
};

const Logout = async () => {
  try {
    const token = localStorage.getItem("token"); // atau sessionStorage
    const response = await useAxios.post(
      "/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        withCredentials: true, // aktifkan kalau pakai Sanctum
      }
    );
    return response.data;
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Unknown error" };
  }
};

export { Login, Logout };
