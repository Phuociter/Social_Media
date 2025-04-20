import axios from 'axios';

const API_URL = 'http://localhost:8080/api/';

// Tạo instance axios với cấu hình chung
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API cho Dashboard
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/stats');   
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Lỗi từ server');
    } else if (error.request) {
      throw new Error('Không thể kết nối đến server');
    } else {
      throw new Error('Có lỗi xảy ra');
    }
  }
};

// API cho User Management
export const getUsers = async (page = 0, size = 10) => {
  try {
    const response = await api.get(`/admin/users?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Lỗi từ server');
    } else if (error.request) {
      throw new Error('Không thể kết nối đến server');
    } else {
      throw new Error('Có lỗi xảy ra');
    }
  }
};

// API cho Post Management
export const getPosts = async (page = 0, size = 10) => {
  try {
    const response = await api.get(`/posts?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    if (error.response) { 
      throw new Error(error.response.data.message || 'Lỗi từ server');
    } else if (error.request) {
      throw new Error('Không thể kết nối đến server');
    } else {
      throw new Error('Có lỗi xảy ra');
    }
  }
}; 