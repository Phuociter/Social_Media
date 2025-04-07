import React, { useState } from "react";
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  FriendsCard,
  Loading,
  PostCard,
  ProfileCard,
  TopBar,
} from "../components";
import { posts } from "../assets/data";
import { NoCover } from "../assets";
import { fetchUserById } from "../api/UserAPI" ;

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const userId = parseInt(id, 10); // ép kiểu từ chuỗi sang int

  // Nếu cần kiểm tra hợp lệ:
  if (isNaN(userId)) {
    return <div>Invalid user ID</div>;
  }

  const { user, selectedUser, loading } = useSelector((state) => state.user);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (id && id !== user?._id) {
      dispatch(fetchUserById(id));
    } else {
      setUserInfo(user);
    }
  }, [id, user, dispatch]);

  useEffect(() => {
    if (id && id !== user?._id && selectedUser) {
      setUserInfo(selectedUser);
    }
  }, [selectedUser, id, user]);

  const handleDelete = () => {};
  const handleLikePost = () => {};

  if (loading || !userInfo) return <Loading />;

  return (
    <>
      <div className='home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
        <TopBar />
        <div className='w-full flex gap-2 lg:gap-4 md:pl-4 pt-5 pb-10 h-full'>
          {/* LEFT */}
          {/*Thử dời vị trí của profìe care sang phân giữa để hợp lý hơn */}
          <div className='hidden w-1/6 lg:w-1/7 md:flex flex-col gap-6 overflow-y-auto'>
            {/*<ProfileCard user={userInfo} />

            <div className='block lg:hidden'>
              <FriendsCard friends={userInfo?.friends} />
            </div>*/}
          </div>

          {/* CENTER */}
          <div className=' flex-1 h-full bg-orimary px-4 flex flex-col gap-6 overflow-y-auto'>
            
            {/*Load ảnh bìa */}
            <img
              src={user?.coverUrl ?? NoCover}
              alt={user?.email}
              className='w-[100%] h-[17.5rem] object-cover' 
            />
            {/*Vị trí mới của phần thông tin người dùng */}

            {user && <ProfileCard user={userInfo} />}
              <div className='block lg:hidden'>
              <FriendsCard friends={userInfo?.friends} />
              </div>

            {loading ? (
              <Loading />
            ) : posts?.length > 0 ? (
              posts?.map((post) => (
                <PostCard
                  post={post}
                  key={post?._id}
                  user={user}
                  deletePost={handleDelete}
                  likePost={handleLikePost}
                />
              ))
            ) : (
              <div className='flex w-full h-full items-center justify-center'>
                <p className='text-lg text-ascent-2'>No Post Available</p>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto'>
            <FriendsCard friends={userInfo?.friends} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
