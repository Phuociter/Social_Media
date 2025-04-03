import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  TopBar,
  ProfileCard,
  FriendsCard,
  CustomButton,
  EditProfile,
  PostCard,
  TextInput,
  Loading,
} from "../components";

import { NoProfile } from "../assets";
import { BsFiletypeGif, BsPersonFillAdd } from "react-icons/bs";
import { BiImages, BiSolidVideo } from "react-icons/bi";
import { useForm } from "react-hook-form";

import {
  getFriendRequests,
  acceptFriendRequest,
  denyFriendRequest,
  getSuggestedFriends,
  sendFriendRequest,
} from "../api/FriendAPI";

// Dữ liệu mock cho posts
// import { posts } from "../assets/data";

const Home = () => {
  const { user, edit } = useSelector((state) => state.user);
  // console.log(user.userId);
  const [friendRequests, setFriendRequests] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const {posts = [], loading = false} = useSelector((state)=>state.posts || {});
  const [posting, setPosting] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [editPostId, setEditPostId] = useState(null);
  const [commentText, setCommentText] = useState("");

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  // Gọi API lấy friendRequests và suggestedFriends khi component mount
  useEffect(() => {
    if (user?.userId) {
      fetchFriendRequests(user.userId);
      fetchSuggestedFriends(user.userId);
    }
    else
    console.log("User ID không tồn tại");
  }, [user?.userId]);

  // Hàm gọi API để lấy danh sách friend requests
  const fetchFriendRequests = async (userId) => {
    try {
      const data = await getFriendRequests(userId);
      console.log("Friend requests data:", data);
      setFriendRequests(data);
    } catch (error) {
      console.error("Lỗi khi lấy friend requests:", error);
    }
  };

  // Hàm gọi API để lấy danh sách gợi ý bạn bè
  const fetchSuggestedFriends = async (userId) => {
    try {
      const data = await getSuggestedFriends(userId);
      setSuggestedFriends(data);
      console.log("Gợi ý bạn bè:", data);
    } catch (error) {
      console.error("Lỗi khi lấy gợi ý bạn bè:", error);
    }
  };

  // Chấp nhận lời mời kết bạn
  const handleAccept = async (requestId) => {
    try {
      await acceptFriendRequest(requestId);
      // Xoá request khỏi danh sách
      setFriendRequests((prev) =>
        prev.filter((req) => req.requestId !== requestId)
      );
      alert("Đã chấp nhận lời mời kết bạn!");
    } catch (error) {
      console.error("Lỗi khi chấp nhận lời mời:", error);
    }
  };

  // Từ chối lời mời kết bạn
  const handleDeny = async (requestId) => {
    try {
      await denyFriendRequest(requestId);
      setFriendRequests((prev) =>
        prev.filter((req) => req.requestId !== requestId)
      );
      alert("Đã từ chối lời mời kết bạn!");
    } catch (error) {
      console.error("Lỗi khi từ chối lời mời:", error);
    }
  };

  // Gửi lời mời kết bạn (từ gợi ý)
  const handleAddFriend = async (receiverId) => {
    if (!receiverId) {
      console.error("Lỗi: receiverId không hợp lệ!");
      return;
    }
    try {
      await sendFriendRequest(user?.userId, receiverId);
      alert("Đã gửi lời mời kết bạn!");
      // Loại bỏ user này khỏi danh sách gợi ý
      setSuggestedFriends((prev) =>
        prev.filter((f) => f.receiverId !== receiverId)
      );
    } catch (error) {
      console.error("Lỗi khi gửi lời mời kết bạn:", error);
    }
  };

  // Hàm handle post (chưa có API nên để trống)
  const handlePostSubmit = async (data) => {
    console.log("Nội dung post:", data);
    console.log("File:", file);
    // Gọi API post nếu có
  };

  //Post

  // Lấy danh sách bài viết khi trang đang load
  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId) return;
      dispatch(getPostsStart());
  
      try {
        const data = await getPosts(userId);
        dispatch(getPostsSuccess(data));
      } catch (err) {
        dispatch(getPostsFailed(err.message));
      }
    };
  
    fetchPosts();
  }, [dispatch, userId]); 
  
  // Tạo bài viết 
  const handlePostSubmit = async () => {
    try{
      
      const newPost = await createPost(user.userId, content, file);
      dispatch(addPost(newPost));
      console.log(newPost);
      setContent('');
      reset({ description: '' }); // Reset giá trị của ô input
      setFile(null);
      setErrMsg(null);
    }catch(err){
      setErrMsg({message: "Failed to post!", status: "failed"});
    }
  };

  // Xóa bài viết
  const handleDeletePost = async (postId) => {
    try{
      await removePost(postId);
      dispatch(deletePost(postId));
    }catch(err){
      alert("Failed to delete post!");
    }
  };

  // Like/unlike
  const handleLikePost  = async(postId) => {
    try{  
      dispatch(toggleLikeState({postId, userId: userId}));
      await toggleLikeAPI(postId, userId);
    }
    catch(err){
      dispatch(toggleLikeState({postId, userId: userId}));
      console.error("Like failed: ", err);
    }
  }
  return (
    <>
      <div className='w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
        <TopBar />

        <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
          {/* LEFT */}
          <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
            <ProfileCard user={user} />
            <FriendsCard friends={user?.friends} />
          </div>

          {/* CENTER */}
          <div className='flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg'>
            <form
              onSubmit={handleSubmit(handlePostSubmit)}
              className='bg-primary px-4 rounded-lg'
            >
              <div className='w-full flex items-center gap-2 py-4 border-b border-[#66666645]'>
                <img
                  src={user?.profileUrl ?? NoProfile}
                  alt='User Image'
                  className='w-14 h-14 rounded-full object-cover'
                />
                <TextInput
                  styles='w-full rounded-full py-5'
                  placeholder="What's on your mind...."
                  name='description'
                  register={register("description", {
                    required: "Write something about post",
                    onChange: (e) => setContent(e.target.value) // Cập nhật state content
                  })}
                  error={errors.description ? errors.description.message : ""}
                />
              </div>
              {errMsg?.message && (
                <span
                  role='alert'
                  className={`text-sm ${
                    errMsg?.status === "failed"
                      ? "text-[#f64949fe]"
                      : "text-[#2ba150fe]"
                  } mt-0.5`}
                >
                  {errMsg?.message}
                </span>
              )}

              <div className='flex items-center justify-between py-4'>
                <label
                  htmlFor='imgUpload'
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                >
                  <input
                    type='file'
                    onChange={(e) => setFile(e.target.files[0])}
                    className='hidden'
                    id='imgUpload'
                    data-max-size='5120'
                    accept='.jpg, .png, .jpeg'
                  />
                  <BiImages />
                  <span>Image</span>
                </label>

                <label
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                  htmlFor='videoUpload'
                >
                  <input
                    type='file'
                    data-max-size='5120'
                    onChange={(e) => setFile(e.target.files[0])}
                    className='hidden'
                    id='videoUpload'
                    accept='.mp4, .wav'
                  />
                  <BiSolidVideo />
                  <span>Video</span>
                </label>

                

                <div>
                  {posting ? (
                    <Loading />
                  ) : (
                    <CustomButton
                      type='submit'
                      title='Post'
                      containerStyles='bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm'
                    />
                  )}
                </div>
              </div>
            </form>

            {loading ? (
              <Loading />
            ) : posts?.length > 0 ? (
              posts?.map((post, index) => (
                <PostCard
                  key={post.postId || index}
                  post={post}
                  user={user}
                  deletePost={() => {}}
                  likePost={() => {}}
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
            {/* FRIEND REQUEST */}
            <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5'>
              <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
                <span> Friend Request</span>
                <span>{ friendRequests?.length}</span>
              </div>

              <div className='w-full flex flex-col gap-4 pt-4'>
                {friendRequests?.map((request, index) => (
                  <div key={request.suggestedUser?.userId || index} className='flex items-center justify-between'>
                    <Link
                      to={`/profile/${request.suggestedUser?.userId}`}
                      className='w-full flex gap-4 items-center cursor-pointer'
                    >
                      <img
                        src={request.suggestedUser?.profileImage ?? NoProfile}
                        alt={request.suggestedUser?.username}
                        className='w-10 h-10 object-cover rounded-full'
                      />
                      <div className='flex-1'>
                        <p className='text-base font-medium text-ascent-1'>
                          {request.suggestedUser?.username}
                        </p>
                        <span className='text-sm text-ascent-2'>
                          {request.suggestedUser?.username ?? "No Profession"}
                        </span>
                      </div>
                    </Link>

                    <div className='flex gap-1'>
                      <CustomButton
                        title='Accept'
                        containerStyles='bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full'
                        onClick={() => handleAccept(request.suggestedUser?.userId)}
                      />
                      <CustomButton
                        title='Deny'
                        containerStyles='border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full'
                        onClick={() => handleDeny(request.suggestedUser?.userId)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUGGESTED FRIENDS */}
            <div className='w-full bg-primary shadow-sm rounded-lg px-5 py-5'>
              <div className='flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]'>
                <span>Friend Suggestion</span>
              </div>
              <div className='w-full flex flex-col gap-4 pt-4'>
                {suggestedFriends?.filter(friend => friend.suggestedUser.userId !== user.userId).map((friend, index) => (
                  <div className='flex items-center justify-between' key={friend.suggestedUser.username || index}>
                    <Link
                      to={`/profile/${friend?.receiverId}`}
                      className='w-full flex gap-4 items-center cursor-pointer'
                    >
                      <img
                        src={friend?.profileUrl ?? NoProfile}
                        alt={friend?.firstName}
                        className='w-10 h-10 object-cover rounded-full'
                      />
                      <div className='flex-1'>
                        <p className='text-base font-medium text-ascent-1'>
                          {friend?.firstName} {friend?.lastName}
                        </p>
                        <span className='text-sm text-ascent-2'>
                          {friend?.suggestedUser.username ?? "No Profession"}
                        </span>
                      </div>
                    </Link>

                    <div className='flex gap-1'>
                      <button
                        className='bg-[#0444a430] text-sm text-white p-1 rounded'
                        onClick={() => handleAddFriend(friend.suggestedUser.userId)}
                      >
                        <BsPersonFillAdd size={20} className='text-[#0f52b6]' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Edit profile modal */}
      {edit && <EditProfile />}
    </>
  );
};

export default Home;
