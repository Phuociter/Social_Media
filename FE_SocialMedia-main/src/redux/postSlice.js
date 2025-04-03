import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  loading: false,
  error: null

};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    //Action load bài viết
    getPostsStart(state) {
      state.loading=true;
      state.error=null;
    },
    getPostsSuccess(state, action){
      console.log("Updating Redux state with:", action.payload);
  state.posts = [...action.payload]; // Gán dữ liệu mới
  state.loading = false;
    },
    getPostsFailed(state, action){
      state.loading = false;
      state.error = action.payload;
    },

    // Action thêm bài viết mới
    addPost(state, action){
      state.posts.unshift(action.payload); //Thêm vào đầu mảng
    },

    // Xóa bài viết
    deletePost(state, action){
      state.posts = state.posts.filter((post)=>post.postId != action.payload);
    },

    // Cập nhật bài viết
    updatePost(state, action){
      const index = state.posts.findIndex((post)=>post.postId==action.payload);
      if(index != -1){
        state.posts[index] = action.payload;
      }
    },
  },
});

export const{
  getPostsStart, 
  getPostsSuccess, 
  getPostsFailed, 
  addPost,
  deletePost,
  updatePost
} = postSlice.actions;


export default postSlice.reducer;

// export function SetPosts(post) {
//   return (dispatch, getState) => {
//     dispatch(postSlice.actions.getPosts(post));
//   };
// }
