import axios from 'axios';

export async function loginUser(email, password) {
  try {
    const response = await axios.post('http://localhost:5173/api/v1/auth/login', {
      email,
      password
    }, {
      withCredentials: true // позволяет axios сохранить куки
    });

    if (response.status === 200) {
      console.log('Login successful');
      return response.headers['set-cookie']; // Возвращает куки для использования в других запросах
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}

export async function loginAdmin(email, password) {
  try {
    const response = await axios.post('http://localhost:5173/api/v1/auth/admin/login', {
      email,
      password
    }, {
      withCredentials: true // позволяет axios сохранить куки
    });

    if (response.status === 200) {
      console.log('Login successful');
      return response.headers['set-cookie']; // Возвращает куки для использования в других запросах
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}