import axios from 'axios';

// Trong ../api/FriendAPI.js
export const loginUser = async (email, password) => {
  // Gọi API backend để xác thực
  const response = await axios.post(`/api/auth/login`, { email, password });
  return response.data; // giả sử response.data chứa { userId: 123, ... }
};


// Gửi lời mời kết bạn
export const sendFriendRequest = async (senderId, receiverId) => {
  const response = await axios.post(`/api/friends/request?senderId=${senderId}&receiverId=${receiverId}`);
  return response.data;
};

// Lấy danh sách lời mời chờ duyệt
export const getFriendRequests = async (receiverId) => {
  const response = await axios.get(`/api/friends/requests?receiverId=${2}`);
  return response.data;
};
/////////////////////// 
/////////////////////// NHỚ LÀM HÀM ĐỂ GỌI RANDOM CÁC ID TRONG FILE NÀY
// Hàm lấy danh sách gợi ý bạn bè
export const getSuggestedFriends = async (userId) => {
    // Thay đổi endpoint tùy theo backend
    const response = await axios.get(`/api/friends/suggestions?userId=${1}`);
    return response.data;
  };
  
  // Hàm từ chối lời mời kết bạn
  export const denyFriendRequest = async (requestId) => {
    // Thay đổi endpoint tùy theo backend
    const response = await axios.delete(`/api/friends/request/${requestId}`);
    return response.data;
  };

// Chấp nhận lời mời kết bạn
export const acceptFriendRequest = async (requestId) => {
  const response = await axios.put(`/api/friends/request/accept/${requestId}`);
  return response.data;
};

// Hủy kết bạn
export const unfriend = async (userId1, userId2) => {
  const response = await axios.delete(`/api/friends/unfriend?userId1=${userId1}&userId2=${userId2}`);
  return response.data;
};

// Lấy danh sách bạn bè
export const getFriendList = async (userId) => {
  const response = await axios.get(`/api/friends/list?userId=${1}`);
  return response.data;
};
