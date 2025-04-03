import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  comments: {},
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

    toggleLikeState(state, action){
      const { postId, userId } = action.payload;
      const post = state.posts.find((p) => p.postId === postId);
      if (post) {
        const likes = post.likes || [];
        const isLiked = likes.some(like => like.userId === userId);
        if (isLiked) {
          post.likes = likes.filter(like => like.userId !== userId);
          post.likeCount -= 1;
        } else {
          post.likes = [...likes, { userId, postId }];
          post.likeCount += 1;
        }
      }
    },

    setCommentsState(state, action){
      const { postId, comments } = action.payload;
      state.comments[postId] = comments; // Lưu comments theo postId
    },

    addCommentState(state, action){
      const {postId, comment} = action.payload;
      if(!state.comments[postId]){
        state.comments[postId] = [];
      }
      state.comments[postId].unshift(comment);

      // Tăng số lượng cmt
      const post = state.posts.find(p => p.postId === postId);;
      if(post){
        post.commentCount = (post.commentCount || 0) + 1;
      }
    }
  },
});

export const{
  getPostsStart, 
  getPostsSuccess, 
  getPostsFailed, 
  addPost,
  deletePost,
  updatePost, 
  toggleLikeState,
  setCommentsState,
  addCommentState,
} = postSlice.actions;


export default postSlice.reducer;

// export function SetPosts(post) {
//   return (dispatch, getState) => {
//     dispatch(postSlice.actions.getPosts(post));
//   };
// }
