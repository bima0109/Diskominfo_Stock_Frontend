import useAxios from ".";
const Login = async (email, password) => {
  try {
    const response = await useAxios.post("/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Unknown error" };
  }
};


export { Login };