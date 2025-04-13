import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchUserById } from "../redux/userSlice";

import {
  FriendsCard,
  Loading,
  PostCard,
  ProfileCard,
  TopBar,
} from "../components";
import { posts } from "../assets/data";
import { NoCover } from "../assets";
import { getPostsFailed, getPostsStart, getPostsSuccess, toggleLikeState } from "../redux/postSlice";
import { getPostsByUserId, toggleLikeAPI } from "../api/PostAPI";
// import { posts } from "../assets/data";  

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  
  const [userInfo, setUserInfo] = useState(user);
  const [ setLoading] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [dispatch, id]);

  console.log("current user: ", currentUser);

  const handleDelete = () => {};
  const handleLikePost = () => {};

  const {posts = [], loading = false} = useSelector((state)=>state.posts || {});
  
  // const { posts } = useSelector((state) => state.posts);
  const [userInfo, setUserInfo] = useState(user);

  const fetchPosts = async () => {
      dispatch(getPostsStart());
      try{
        const data = await getPostsByUserId(id);
        dispatch(getPostsSuccess(data));
        
      } catch (err) {
        dispatch(getPostsFailed(err.message));
      }
    };
  
    useEffect(() => {
      fetchPosts();
    }, [dispatch, id]); 

// Like/unlike
  const handleLikePost  = async(postId) => {
    try{  
      console.log("postid userid", postId, user.userId);
      dispatch(toggleLikeState({postId, userId: user.userId}));

      await toggleLikeAPI(postId, user.userId);
      
    }
    catch(err){
      dispatch(toggleLikeState({postId, userId: user.userId}));
      console.error("Like failed: ", err);
    }
  }
  return (
    <>
      <div className='home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
        <TopBar />
        <div className='w-full flex gap-2 lg:gap-4 md:pl-4 pt-5 pb-10 h-full'>
          {/* LEFT */}
          {/*Thử dời vị trí của profìe care sang phân giữa để hợp lý hơn */}
          <div className='hidden w-1/6 lg:w-1/7 md:flex flex-col gap-6 overflow-y-auto'>
            <div className='block lg:hidden'>
              <FriendsCard userId={user?.userId} />
            </div>
          </div>

          {/* CENTER */}
          <div className=' flex-1 h-full bg-orimary px-4 flex flex-col gap-6 overflow-y-auto'>
            
            {/*Load ảnh bìa */}
            <img
              src={currentUser?.profileCover?? NoCover}
              alt={currentUser?.email}
              className='w-[100%] h-[17.5rem] object-cover' 
            />
            {/*Vị trí mới của phần thông tin người dùng */}

            <ProfileCard user={currentUser} />
              <div className='block lg:hidden'>
              <FriendsCard friends={currentUser?.friends} />
              </div>

            {loading ? (
              <Loading />
            ) : posts?.length > 0 ? (
              posts?.map((post) => (
                <PostCard
                  post={post}
                  key={post?._id}
                  user={currentUser}
                  deletePost={handleDelete}
                  likePost={handleLikePost}
                />
              ))
            {loading ? (
              <Loading />
            ) : posts && posts?.length > 0 ? (
              [...posts]
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sắp xếp giảm dần theo timestamp
              .map((post, index) => {
                console.log("Post ID:", post.postId, "Likes:", post.likes);
                return (
                <PostCard
                  key={post.postId || index}
                  post={post}
                  user={user}
                  
                  // deletePost={() => handleDeletePost(post.postId)}
                  likePost={() => handleLikePost(post.postId)}
                />
              )})
            ) : (
              <div className='flex w-full h-full items-center justify-center'>
                <p className='text-lg text-ascent-2'>No Post Available</p>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto'>
            <FriendsCard userId={user?.userId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
