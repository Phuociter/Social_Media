import { createSlice } from "@reduxjs/toolkit";

// Khởi tạo state ban đầu, không sử dụng localStorage và không dùng dữ liệu mẫu từ asset
const initialState = {
  user: JSON.parse(window?.localStorage.getItem("user")),
  edit: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      // Không lưu vào localStorage
    },
    logout(state) {
      state.user = null;
      // Không xóa dữ liệu từ localStorage
    },
    updateProfile(state, action) {
      state.edit = action.payload;
    },
  },
});

export default userSlice.reducer;

// Action creator dùng để dispatch action đăng nhập với dữ liệu từ API
export function UserLogin(user) {
  return (dispatch) => {
    dispatch(userSlice.actions.login(user));
  };
}

// Nếu cần đăng ký, bạn phải định nghĩa reducer register trong slice, nếu không, loại bỏ UserRegister.
export function UserRegister(user) {
  return (dispatch) => {
    // Giả sử bạn có reducer register, nếu không, loại bỏ function này.
    dispatch(userSlice.actions.register(user));
  };
}

export function Logout() {
  return (dispatch) => {
    dispatch(userSlice.actions.logout());
  };
}

export function UpdateProfile(val) {
  return (dispatch) => {
    dispatch(userSlice.actions.updateProfile(val));
  };
}
