import { createSlice } from "@reduxjs/toolkit";

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
      window.localStorage.setItem("user", JSON.stringify(action.payload));
      // Không lưu vào localStorage
    },
    register(state, action) {
      state.user = action.payload;
      window.localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout(state) {
      state.user = null;
      window.localStorage.removeItem("user");
      // Không xóa dữ liệu từ localStorage
    },
    updateProfile(state, action) {
      state.edit = action.payload;
    },
  },
});

export default userSlice.reducer;

export function UserLogin(user) {
  return (dispatch) => {
    dispatch(userSlice.actions.login(user));
  };
}

// Nếu cần đăng ký, bạn phải định nghĩa reducer register trong slice, nếu không, loại bỏ UserRegister.
export function UserRegister(user) {
  return (dispatch, getState) => {

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
