import axios from "axios";

const baseUrl = process.env.VITE_BASE_URL || "http://localhost:5173";
console.log(baseUrl);

export async function loginUser(email, password) {
  try {
    const response = await axios.post(
      `${baseUrl}/api/v1/auth/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true, // позволяет axios сохранить куки
      }
    );

    if (response.status === 200) {
      console.log("Login successful");
      return response.headers["set-cookie"]; // возвращает куки для использования в других запросах
    } else {
      throw new Error("Ошибка авторизации");
    }
  } catch (error) {
    console.error("Ошибка авторизации: ", error);
    throw error;
  }
}

export async function loginAdmin(email, password) {
  try {
    const response = await axios.post(
      `${baseUrl}/api/v1/auth/admin/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      return response.headers["set-cookie"];
    } else {
      throw new Error("Login failed");
    }
  } catch (error) {
    console.error("Error during login: ", error);
    throw error;
  }
}
