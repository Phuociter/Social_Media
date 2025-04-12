import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = async (email, password) => {
  // Gọi API backend để xác thực
  const response = await axios.post(`/api/auth/login`, { email, password });
  return response.data; // giả sử response.data chứa { userId: 123, ... }
};

//Sửa thông tin người dùng
export const setUserInfo = async (userId) => {
    const response = await axios.get(`/api/users/userId=${userId}}/Profile/InfoChanging`);
    return response.data;
  };
  
  //Sửa thông tin người dùng
export const setUserAvarta = async (userId) => {
    const response = await axios.get(`/api/users/userId=${userId}/Profile/PictureChanging`);
    return response.data;
  };
  
  //Sửa ảnh bìa
export const setUserCover = async (userId) => {
    const response = await axios.get(`/api/users/userId=${userId}/Profile/CoverChanging`);
    return response.data;
  };


  export const fetchUserById = createAsyncThunk(
    'user/fetchUserById',
    async (id, thunkAPI) => {
      try {
        const response = await axios.get(`/api/users/userId=${userId}`);
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
      }
    }
  );

