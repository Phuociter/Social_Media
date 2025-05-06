import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserById } from "../redux/userSlice";

import {
  FriendsCard,
  Loading,
  PostCard,
  ProfileCard,
  TopBar,
} from "../components";
import { NoCover } from "../assets";
import { 
  getPostsFailed, 
  getPostsStart, 
  getPostsSuccess, 
  toggleLikeState 
} from "../redux/postSlice";
import { getPostsByUserId, toggleLikeAPI } from "../api/PostAPI";

//user: nguoi dung dang dang nhap
//currentUser: chu profile

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
   const navigate = useNavigate();

  // Lấy thông tin người dùng từ redux
  const { user, currentUser, loading1, error } = useSelector((state) => state.user);
  // Khai báo state cho loading (nếu cần dùng trong component)
  const [loading, setLoading] = useState(false);

  // Fetch thông tin user theo id từ route
  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [dispatch, id]);

  // console.log("current user: ", currentUser);

    const handleSearch = (results) => {
    navigate("/", { state: { searchResults: results } });
  };

  
  const handleDelete = () => {
    // Xử lý khi xóa post (nếu cần)
  };

  // Lấy danh sách post từ redux (đặt tên khác để tránh nhầm lẫn với biến posts ở assets nếu có)
  const { posts: userPosts = [] } = useSelector((state) => state.posts || {});

  // Function fetch posts theo user id
  const fetchPosts = async () => {
    dispatch(getPostsStart());
    try {
      const data = await getPostsByUserId(id);
      dispatch(getPostsSuccess(data));
    } catch (err) {
      dispatch(getPostsFailed(err.message));
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [dispatch, id]);

  // Xử lý like/unlike
  const handleLikePost  = async (postId) => {
    try {  
      console.log("postId, userId", postId, user?.userId);
      dispatch(toggleLikeState({ postId, userId: user?.userId }));
      await toggleLikeAPI(postId, user?.userId);
    } catch(err) {
      dispatch(toggleLikeState({ postId, userId: user?.userId }));
      console.error("Like failed: ", err);
    }
  };

  return (
    <div className='home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
      <TopBar onSearch= {handleSearch} />
      <div className='w-full flex gap-2 lg:gap-4 md:pl-4 pt-5 pb-10 h-full'>
        {/* LEFT */}
        <div className='hidden w-1/6 lg:w-1/7 md:flex flex-col gap-6 overflow-y-auto'>
          <div className='block lg:hidden'>
            <FriendsCard userId={currentUser?.userId} />
          </div>
        </div>

        {/* CENTER */}
        <div className='flex-1 h-full bg-orimary px-4 flex flex-col gap-6 overflow-y-auto'>
          {/* Load ảnh bìa */}
          <img
            src={currentUser?.profileCover              ?? NoCover}
            alt={currentUser?.email}
            className='w-[100%] h-[17.5rem] object-cover' 
          />
          {/* Thông tin người dùng */}
          <ProfileCard user={currentUser} />
          <div className='block lg:hidden'>
            <FriendsCard friends={currentUser?.friends} />
          </div>

          {/* Render post */}
          {loading1 ? (
            <Loading />
          ) : userPosts && userPosts.length > 0 ? (
            [...userPosts]
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((post, index) => {
                // console.log("Post ID:", post.postId, "Likes:", post.likes, "Author: ", post.user.userId);
                return (
                  <PostCard
                    key={post.postId || index}
                    post={post}
                    user={user}
                    deletePost={handleDelete}
                    likePost={() => handleLikePost(post.postId)}
                  />
                );
              })
          ) : (
            <div className='flex w-full h-full items-center justify-center'>
              <p className='text-lg text-ascent-2'>No Post Available</p>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto'>
          <FriendsCard userId={currentUser?.userId} currentId={user?.userId} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
