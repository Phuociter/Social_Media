import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  comments: {},
  loading: false,
  error: null

};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    //Action load bài viết
    getPostsStart(state) {
      state.loading=true;
      state.error=null;
    },
    getPostsSuccess(state, action){
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
      const postId = action.payload;

      state.posts = state.posts.filter((post)=>post.postId !== postId);
    },

    // Cập nhật bài viết
    updatePost(state, action){
      const updatedPost = action.payload;
      const index = state.posts.findIndex((post)=>post.postId===updatedPost.postId);
      if(index != -1){
        state.posts[index] = action.payload;
      }
    },
    
    toggleLikeState(state, action){
      const { postId, userId } = action.payload;
      const post = state.posts.find((p) => p.postId === postId);
      if (post) {
        const likes = post.likes || [];
        const isLiked = likes.some(like => String(like.user.userId) === String(userId));
        if (isLiked) {
          post.likes = likes.filter(like => like.user.userId !== userId);
          post.likeCount -= 1;
        } else {
          post.likes = [...likes, { user: {userId}, postId }];
          post.likeCount += 1;
        }
      }
    },

    toggleLikeCommentState(state, action) {
      const { postId, commentId, userId } = action.payload;
      
      const comments = state.comments[postId] || [];
      const comment = comments.find((c) => c.commentId === commentId);
      
      if (comment) {
        const likes = comment.likes || [];
        const isLiked = likes.some(like => like.user.userId === userId);
        
        comment.likes = isLiked
          ? likes.filter(like => like.user.userId !== userId)
          : [...(likes || []), {commentId, user: {userId}}]; // Lưu trực tiếp userId
      }
    },

    setCommentsState(state, action){
      const { postId, comments } = action.payload;
      state.comments[postId] = comments; // Lưu comments theo postId
    },

    addCommentState(state, action) {
      const { id: postId, comment } = action.payload;
      // Tạo bản sao mới của comments
      state.comments = {
        ...state.comments,
        [postId]: state.comments[postId] ? [...state.comments[postId], comment] : [comment]
      };
      // Xử lý commentCount trong post
      const postIndex = state.posts.findIndex(p => p.postId === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].commentCount = (state.posts[postIndex].commentCount || 0) + 1;
      }
    },

    replaceOptimisticComment(state, action){
      const { postId, tempCommentId, realComment } = action.payload;
      const comments = state.comments[postId];
      if (comments) {
        const index = comments.findIndex(c => c.commentId === tempCommentId);
        if (index !== -1) {
          comments[index] = realComment;
        }
      }
    },
    removeOptimisticComment(state, action){
      const { postId, tempCommentId } = action.payload;
      const comments = state.comments[postId];
      if (comments) {
        state.comments[postId] = comments.filter(c => c.commentId !== tempCommentId);
        
        // Giảm số lượng comment
        const post = state.posts.find(p => p.postId === postId);
        if (post) {
          post.commentCount = Math.max(0, (post.commentCount || 0) - 1);
        }
      }
    },
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      if (!state.commentsByPostId[postId]) {
        state.commentsByPostId[postId] = [];
      }
      state.commentsByPostId[postId].push(comment);
    },
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
  addComment,
  toggleLikeCommentState
} = postSlice.actions;


export default postSlice.reducer;

// export function SetPosts(post) {
//   return (dispatch, getState) => {
//     dispatch(postSlice.actions.getPosts(post));
//   };
// }
