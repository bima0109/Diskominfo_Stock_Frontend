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

//logout



export { Login };