import axios from 'axios';

// Tạo bài viết mới (chỉ 1 file)
export const createPost = async (userId, content, mediaFile) => {
  const formData = new FormData();
  formData.append("userid", userId);
  formData.append("content", content);

  if (mediaFile) {
    console.log("Appending single file:", mediaFile);
    formData.append("mediaFile", mediaFile); // Chỉ append 1 file
  }

  // Debug: Kiểm tra FormData trước khi gửi
  console.log("FormData Entries:");
  for (let [key, value] of formData.entries()) {
    console.log(key, value instanceof File ? `${value.name} (${value.size} bytes)` : value);
  }

  try {
    const response = await axios.post(`/api/posts/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error.response?.data || error.message);
    throw error;
  }
};

// Chỉnh sửa bài viết
export const editPost = async(postId, description, mediaFile, removedOldMedia) => {
  const formData = new FormData();
  formData.append("description", description);

  if (mediaFile) {
    formData.append("media", mediaFile);
  }

  if (removedOldMedia) {
    formData.append("removeMedia", "true"); // báo BE xóa luôn media cũ
  }
  const response = await axios.put(`/api/posts/update/${postId}`, formData, {
        headers: {"Content-Type":"multipart/form-data"}
      });
      return response.data; 

};

// Xóa bài viết
export const removePost = async(postId) => {
    const response = await axios.delete(`http://localhost:8080/api/posts/delete/${postId}`);
    return response.data;
};

// Like/unlike bài viết (POST /api/likes)
export const toggleLikeAPI = async (postId, userId) => {
  try {
    const response = await axios.post(`/api/likes?userId=${userId}&postId=${postId}`);
    console.log("Like API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Like API Error:", error);
    return { success: false, error: "Failed to like post" };
  }
};

// Like/unlike bài viết (POST /api/likes/comment)
export const toggleLikeCommentAPI = async (commentId, userId) => {
  try {
    const response = await axios.post(`/api/likes/comment?userId=${userId}&commentId=${commentId}`);
    console.log("Like API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Like API Error:", error);
    return { success: false, error: "Failed to like post" };
  }
};
// // Lấy danh sách like của bài viết 
// export const getPostLikes = async (postId) => {
//   try {
//     const response = await axios.get(`/api/posts/${postId}/likes`);
//     return response.data;
//   } catch (error) {
//     console.error("Get likes error:", error);
//     return [];
//   }
// };

// Lấy  count cmt
export const getCommentsAPI = async (postId) => {
  const response = await axios.get(`/api/comments/${postId}`);
  console.log("data comt từ BE", response.data);
  return response.data;
  
}

// Bình luận bài viết
export const createCommentAPI = async(postId, userId, comment) => {
    const response = await axios.post(`/api/comments/add?postId=${postId}&userId=${userId}&comment=${comment}`);
    return response.data;
};

// // Chia sẻ bài viết
// export const sharePost = async(postId, userId) => {
//     const response = await axios.post(`/api/posts/share`, {postId, userId});
//     return response.data;
// };

// Lấy danh sách bài viết
export const getPosts = async (count) => {
  try {
      const response = await axios.get(`/api/posts?count=${count}`); //?userid=${userId}
      console.log("API Response:", response.data); // Log dữ liệu từ API
      return response.data;
  } catch (error) {
      console.error("API Error:", error);
      return [];
  }
};

// Lấy 1 bài viết
export const getPostById = async (postId) => {
  try {
      const response = await axios.get(`/api/posts/${postId}`); //?userid=${userId}
      console.log("API Response:", response.data); // Log dữ liệu từ API
      return response.data;
  } catch (error) {
      console.error("API Error:", error);
      return [];
  }
};






