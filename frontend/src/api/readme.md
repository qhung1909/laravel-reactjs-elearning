File src/api, trong đây chứa các hàm để gọi API từ BackEnd Laravel

ví dụ gọi API đơn giản như sau:


//
const API_URL = process.env.APP_URL;

const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
//