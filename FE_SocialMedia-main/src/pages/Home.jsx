import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
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

import { SearchResults } from "../components"

import { BiImages, BiSolidVideo, BiSolidXCircle } from "react-icons/bi";
import { useForm } from "react-hook-form";

import {
  getFriendRequests,
  acceptFriendRequest,
  denyFriendRequest,
  getSuggestedFriends,
  getFriendList,
  sendFriendRequest,
} from "../api/FriendAPI";

import {
  getPosts,
  createPost,
  editPost,
  removePost,
  commentPost,
  sharePost,
  toggleLikeAPI,
  getPostById,
} from "../api/PostAPI";

import {
  getPostsStart,
  getPostsSuccess,
  getPostsFailed,
  addPost,
  deletePost,
  updatePost,
  toggleLikeState
} from "../redux/postSlice";

const Home = () => {
  const { user, edit } = useSelector((state) => state.user);
  // console.log("userrrrr: ", user);
  const userId = user?.userId;
  const [friendRequests, setFriendRequests] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [file, setFile] = useState(null);

  const dispatch = useDispatch();
  const { posts = [], loading = false } = useSelector((state) => state.posts || {});
  const [posting, setPosting] = useState(false);

  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(null);
  console.log("post orw home: ", posts);

  // State cho tìm kiếm
  const [searchResults, setSearchResults] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);

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
      let data = await getFriendRequests(userId);
      setFriendRequests(data);


    } catch (error) {
      console.error("Lỗi khi lấy friend requests:", error);
    }
  };

  // Hàm gọi API để lấy danh sách gợi ý bạn bè
  const fetchSuggestedFriends = async (userId) => {
    try {
      const friendList = await getFriendList(userId);
      // Lấy danh sách các userId bạn bè
      const friendIds = friendList.map(friend => {

        if (friend.user1.userId === userId) {
          return friend.user2.userId;
        } else if (friend.user2.userId === userId) {
          return friend.user1.userId;
        }
      }).filter(id => id !== undefined);

      var filteredData;
      const data = await getSuggestedFriends(userId);

      if (friendIds.length !== 0) {
        filteredData = data.filter(suggested =>
          !friendIds.includes(suggested.userId)
        );
      }

      else
        filteredData = data;
      setSuggestedFriends(filteredData);

    } catch (error) {
      console.error("Lỗi khi lấy gợi ý bạn bè:", error);
    }
  };

  // Chấp nhận lời mời kết bạn
  const handleAccept = async (request) => {
    try {
      await acceptFriendRequest(request.requestId);
      // Xoá request khỏi danh sách
      setFriendRequests((prev) =>
        prev.filter((req) => req.sender.userId !== request.sender.userId)

      );
      alert("Đã chấp nhận lời mời kết bạn!");
    } catch (error) {
      console.error("Lỗi khi chấp nhận lời mời:", error);
    }
  };

  // Từ chối lời mời kết bạn
  const handleDeny = async (request) => {
    try {
      await denyFriendRequest(request.requestId);
      setFriendRequests((prev) =>
        prev.filter((req) => req.userId !== request.sender.userId)

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
        prev.filter((f) => f.userId !== receiverId)

      );
    } catch (error) {
      console.error("Lỗi khi gửi lời mời kết bạn:", error);
    }
  };

  //Post

  const { postId } = useParams();
  const count = 5;
  // Lấy danh sách bài viết khi trang đang load
  const fetchPosts = async () => {
    dispatch(getPostsStart());
    try {
      if (postId) { // Chế độ xem 1 bài
        console.log("")
        console.log("Chế độ xem 1 bài  viết với ID: ", postId);
        const singlePost = await getPostById(postId);
        console.log("singlePost: ", singlePost);
        if (singlePost) {
          dispatch(getPostsSuccess([singlePost]));
        } else {
          console.warn("Không tìm thấy bài viết với ID:", postId);
          // posts = []
          dispatch(getPostsSuccess([])); // hoặc set một state báo lỗi
          dispatch(getPostsFailed("lỗi"));

        }


      }
      else {
        const data = await getPosts(count);
        dispatch(getPostsSuccess(data));
      }
    } catch (err) {
      dispatch(getPostsFailed(err.message));
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [dispatch, postId, count]);


  // Tạo bài viết 
  const handlePostSubmit = async () => {
    try {

      const newPost = await createPost(user.userId, content, file);
      dispatch(addPost(newPost));
      console.log(newPost);
      setContent('');
      reset({ description: '' }); // Reset giá trị của ô input
      setFile(null);
      setErrMsg(null);
    } catch (err) {
      setErrMsg({ message: "Failed to post!", status: "failed" });
    }
  };


  // Like/unlike
  const handleLikePost = async (postId) => {
    try {
      dispatch(toggleLikeState({ postId, userId: userId }));
      await toggleLikeAPI(postId, userId);
    }
    catch (err) {
      dispatch(toggleLikeState({ postId, userId: userId }));
      console.error("Like failed: ", err);
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFile(file);
  };
  const validPosts = Array.isArray(posts)
    ? posts.filter(p => p && p.postId)  // Lọc luôn cả post rỗng hoặc thiếu ID
    : [];

  return (
    <>
      <div className='w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
        <TopBar onSearch={(results) => {
          setSearchResults(results);
          setIsSearching(true);
          setShowAllUsers(false);
          setShowAllPosts(false);
        }} />

        <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
          {/* LEFT */}
          <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
            <ProfileCard user={user} />
            <FriendsCard userId={user?.userId} />
          </div>

          {/* CENTER */}
       {/* CENTER */}
<div className='flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg'>
  {/* Nếu đang tìm kiếm, hiển thị kết quả tìm kiếm */}
  {isSearching ? (
    <SearchResults
      results={searchResults}
      user={user}
      onClear={() => {
        setIsSearching(false);
        setSearchResults({});
      }}
      onLikePost={handleLikePost}
      showAllUsers={showAllUsers}
      setShowAllUsers={setShowAllUsers}
      showAllPosts={showAllPosts}
      setShowAllPosts={setShowAllPosts}
    />
  ) : (
    // Khi không tìm kiếm, hiển thị form đăng bài
    <form onSubmit={handleSubmit(handlePostSubmit)} className='bg-primary px-4 rounded-lg'>
      {/* Phần đầu của form: Avatar và TextInput */}
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

      {/* Thông báo lỗi */}
      {errMsg?.message && (
        <span
          role='alert'
          className={`text-sm ${
            errMsg?.status === "failed" ? "text-[#f64949fe]" : "text-[#2ba150fe]"
          } mt-0.5`}
        >
          {errMsg?.message}
        </span>
      )}

      {/* Phần upload ảnh và video */}
      <div className='flex items-center justify-between py-4'>
        {/* Upload ảnh */}
        <label htmlFor='imgUpload' className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'>
          <input
            type='file'
            onChange={handleFileChange}
            className='hidden'
            id='imgUpload'
            data-max-size='5120'
            accept='.jpg, .png, .jpeg'
          />
          <BiImages />
          <span>Image</span>
        </label>

        {/* Upload video */}
        <label
          className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
          htmlFor='videoUpload'
        >
          <input
            type='file'
            data-max-size='5120'
            onChange={handleFileChange}
            className='hidden'
            id='videoUpload'
            accept='.mp4, .wav'
          />
          <BiSolidVideo />
          <span>Video</span>
        </label>

        {/* Nút đăng bài */}
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
      
      {/* Hiển thị preview file (Ảnh/Video) */}
      {file && (
        <div className="relative w-full mt-2">
          {file.type.startsWith("video/") ? (
            <video controls className="w-full rounded-lg">
              <source src={URL.createObjectURL(file)} type={file.type} />
            </video>
          ) : (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-full rounded-lg"
            />
          )}
          {/* Nút xoá */}
          <button
            type="button"
            onClick={() => setFile(null)}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black"
          >
            <BiSolidXCircle color="black" size={20} />
          </button>
        </div>
      )}
    </form>
  )}

  {/* Nếu không tìm kiếm, hiển thị bài viết */}
  {loading ? (
    <Loading />
  ) : isSearching ? (
    // Nếu đang tìm kiếm, chỉ hiển thị các bài viết trong searchResults
    searchResults.posts && searchResults.posts.length > 0 ? (
      searchResults.posts
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sắp xếp giảm dần theo timestamp
        .map((post, index) => (
          <PostCard
            key={post.postId || index}
            post={post}
            user={user}
            likePost={() => handleLikePost(post.postId)}
          />
        ))
    ) : (
      <div className='flex w-full h-full items-center justify-center'>
        <p className='text-lg text-ascent-2'>No Post Found</p>
      </div>
    )
  ) : (
    // Khi không tìm kiếm, hiển thị tất cả các bài viết
    validPosts.length > 0 ? (
      validPosts
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sắp xếp giảm dần theo timestamp
        .map((post, index) => (
          <PostCard
            key={post.postId || index}
            post={post}
            user={user}
            likePost={() => handleLikePost(post.postId)}
          />
        ))
    ) : (
      <div className='flex w-full h-full items-center justify-center'>
        <p className='text-lg text-ascent-2'>No Post Available</p>
      </div>
    )
  )}
</div>


          {/* RIGHT */}
          <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto'>
            {/* FRIEND REQUEST */}
            <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5'>
              <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
                <span> Friend Request</span>
                <span>{friendRequests?.length}</span>
              </div>

              <div className='w-full flex flex-col gap-4 pt-4'>
                {friendRequests?.map((request, index) => (
                  <div key={request.sender?.userId || index} className='flex items-center justify-between'>
                    <Link
                      to={`/profile/${request.sender?.userId}`}
                      className='w-full flex gap-4 items-center cursor-pointer'
                    >
                      <img
                        src={request.sender?.profileImage ?? NoProfile}
                        alt={request.sender?.username}

                        className='w-10 h-10 object-cover rounded-full'
                      />
                      <div className='flex-1'>
                        <p className='text-base font-medium text-ascent-1'>
                          {request.sender?.username}
                        </p>
                        <span className='text-sm text-ascent-2'>
                          {request.sender?.username ?? "No Profession"}

                        </span>
                      </div>
                    </Link>

                    <div className='flex gap-1'>
                      <CustomButton
                        title='Accept'
                        containerStyles='bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full'
                        onClick={() => handleAccept(request)}

                      />
                      <CustomButton
                        title='Deny'
                        containerStyles='border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full'
                        onClick={() => handleDeny(request)}

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
                {suggestedFriends?.filter(friend => friend.userId !== user.userId).map((friend, index) => (
                  <div className='flex items-center justify-between' key={friend.username || index}>
                    <Link
                      to={`/profile/${friend?.userId}`}

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
                          {friend?.username ?? "No Profession"}

                        </span>
                      </div>
                    </Link>

                    <div className='flex gap-1'>
                      <button
                        className='bg-[#0444a430] text-sm text-white p-1 rounded'
                        onClick={() => handleAddFriend(friend.userId)}

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
