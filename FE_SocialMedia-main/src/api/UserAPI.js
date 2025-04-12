import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = async (email, password) => {
  // Gọi API backend để xác thực
  const response = await axios.post(`/api/auth/login`, { email, password });
  return response.data; // giả sử response.data chứa { userId: 123, ... }
};


export const updateInfoUser = async (userId, userData) => {
  try {
    const response = await axios.post(`/api/users/${userId}/InfoChanging`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // trả về user đã được cập nhật
  } catch (error) {
    console.error("Lỗi khi cập nhật user:", error.response ? error.response.data : error.message);
    throw error;
  }
};

  //Sửa thông tin người dùng
  export const uploadProfilePicture = async (userId, file) => {
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post(`/api/users/${userId}/Profile/PictureChanging`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Fetch lại thông tin user mới nhất
      const updatedUser = await axios.get(`/api/users/${userId}`);
      return updatedUser.data; // Trả về dữ liệu user mới
    } catch (err) {
      console.error("Upload avatar failed", err);
      throw err;
    }
  };
  
  // Upload ảnh bìa
  export const uploadCoverPicture = async (userId, file) => {
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post(`/api/users/${userId}/Profile/CoverChanging`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Fetch lại thông tin user mới nhất
      const updatedUser = await axios.get(`/api/users/${userId}`);
      return updatedUser.data; // Trả về dữ liệu user mới
    } catch (err) {
      console.error("Upload cover failed", err);
      throw err;
    }
  };


  export const fetchUserById = createAsyncThunk(
    "user/fetchUserById",
    async (userId, thunkAPI) => {
      try {
        const response = await axios.get(`/api/users/${userId}`);
        // Loại bỏ mật khẩu để không lộ thông tin nhạy cảm
        response.data.password = null;
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data || "Something went wrong"
        );
      }
    }
  );