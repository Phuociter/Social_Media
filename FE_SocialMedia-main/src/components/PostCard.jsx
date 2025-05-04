import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { NoProfile } from "../assets";
import { BiComment, BiDotsVerticalRounded, BiImages, BiLike, BiShare, BiSolidLike, BiSolidVideo, BiSolidXCircle, BiX } from "react-icons/bi";
import { MdDelete, MdEdit, MdOutlineDeleteOutline } from "react-icons/md";
import Loading from "./Loading";
import { useForm } from "react-hook-form";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { createCommentAPI, editPost, getCommentsAPI, removePost, toggleLikeCommentAPI } from "../api/PostAPI";
import { useDispatch, useSelector } from "react-redux";
import { addCommentState, replaceOptimisticComment, removeOptimisticComment, setCommentsState, deletePost, updatePost, toggleLikeCommentState } from "../redux/postSlice";
import { createSelector } from "@reduxjs/toolkit";
import axios from "axios";
import { sendNotification } from "../api/NotificationsAPI";

const CommentForm = ({ user, id}) => {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();


  const onSubmit = async (data, e) => {
    if (!user?.userId) {
      setErrMsg({
        status: "failed",
        message: "You need to login to comment",
      });
      return;
    }

    try {
      // 1. Ngăn reload trang
      e.preventDefault(); // (Nếu dùng event object thay vì handleSubmit)

      // 2. Tạo comment object
      const newComment = await createCommentAPI(
        id,
        user.userId,
        data.comment
      );

      // 3. Dispatch action
      dispatch(addCommentState({ id, comment: newComment }));
            //gửi thông like báo bình luận/////////////////////////////////////////
      const commentID = await axios.get(`/api/comments/latest/${user?.userId}`);
      const userIdOfPost = await axios.get(`/api/posts/userid/${id}`);
      await sendNotification(user?.userId, userIdOfPost.data, 'comment_post', commentID.data);
      // 4. Reset form - CÁCH ĐÚNG
      reset({ comment: "" }); // Reset cụ thể field

      // Hoặc nếu reset không hoạt động:
      // document.getElementById("comment-form").reset(); // Reset thủ công

    } catch (error) {
      console.error("Submit error:", error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='w-full border-b border-[#66666645]'
    >
      <div className='w-full flex items-center gap-2 py-4'>
        <img
          src={user?.profileImage ?? NoProfile}
          alt='User Image'
          className='w-10 h-10 rounded-full object-cover'
        />

        <TextInput
          name='comment'
          styles='w-full rounded-full py-3'
          placeholder={ "Comment this post"}
          register={register("comment", {
            required: "Comment can not be empty",
          })}
          error={errors.comment ? errors.comment.message : ""}
        />
      </div>
      {errMsg?.message && (
        <span
          role='alert'
          className={`text-sm ${errMsg?.status === "failed"
              ? "text-[#f64949fe]"
              : "text-[#2ba150fe]"
            } mt-0.5`}
        >
          {errMsg?.message}
        </span>
      )}

      <div className='flex items-end justify-end pb-2'>
        {loading ? (
          <Loading />
        ) : (
          <CustomButton
            title='Submit'
            type='submit'
            containerStyles='bg-[#0444a4] text-white py-1 px-3 rounded-full font-semibold text-sm'
          />
        )}
      </div>
    </form>
  );
};


const PostCard = ({ post, user, likePost }) => {
  const [showAll, setShowAll] = useState(0);
  const [showReply, setShowReply] = useState(0);
  // const [comments, setComments] = useState([]);
  const selectCommentsForPost = createSelector(
    (state) => state.posts.comments,
    (_, postId) => postId,
    (comments, postId) => comments[postId] || []
  );
  //console.log(post);
  const comments = useSelector((state) => selectCommentsForPost(state, post?.postId));
  //console.log("Useselector: ", comments);
  const [loading, setLoading] = useState(false);
  // const [replyComments, setReplyComments] = useState(0);
  const [showComments, setShowComments] = useState(null);
  const postId = post.postId;
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const theme = useSelector((state) => state.theme.theme); // Lấy giá trị theme từ Redux store
  

  const isPostAuthor =
    post?.user?.userId === user?.userId ;
  const [isEditing, setIsEditing] = useState(false);
  const [editedFile, setEditedFile] = useState(null);

  const [removedOldMedia, setRemovedOldMedia] = useState(false);

  
  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: post?.content || ""
    }
  });

  
// PostCard.jsx
// PostCard.jsx
useEffect(() => {
   if (!post || !user) return null;
    if (!post || !user) return;       // ← no value returned
  
     // any logging or setup you need
     console.log("PostCard - Post ID:", post.postId, "Likes:", post.likes);
   }, [post, user]);
  

  // Kiểm tra dữ liệu trước khi render
  
  const getComments = async () => {
    try {
      setLoading(true);
      const response = await getCommentsAPI(postId);
      //console.log("Full API Response:", response);

      // Thử cả 2 cách truy cập dữ liệu
      const commentsData = response.data || response;
      //console.log("Processed Comments Data:", commentsData);

      dispatch(setCommentsState({
        postId: postId, // Thêm postId vào payload
        comments: Array.isArray(commentsData) ? commentsData : []
      }));

      setLoading(false);
    } catch (error) {
      //console.error('Error fetching comments:', error);
      setLoading(false);
    }
  };

  // Xóa post

  const handleDelete = async (postId) => {
    if (window.confirm('Bạn chắc chắn muốn xóa bài viết này?')) {
      try {
        //console.log("dhflnks", postId);
        const data = await removePost(postId);
        //console.log(data);
        dispatch(deletePost(postId));
        alert('Xóa bài viết thành công!');
      } catch (error) {
        alert('Xóa thất bại: ' + error.message);
      }
    }
  };
  // Hàm xử lý khi nhấn nút comment
  const handleShowComments = () => {
    // Nếu đang hiển thị comment của bài viết này thì ẩn đi
    if (showComments === postId) {
      setShowComments(null);
    } else {
      // Nếu không thì hiển thị comment
      setShowComments(postId);
      getComments(); // Gọi API lấy comment
      //console.log("gọi được cmt không z");
    }
  };

  // Share
  const handleShare = async () => {
    const shareLink = `${window.location.origin}/posts/${postId}`;
    try {
    // Copy vào clipboard
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        setShowToast(true);
        
        setTimeout(() => setShowToast(false), 2000); // Ẩn thông báo sau 2s
      })
      .catch(err => console.error("Copy failed:", err));
    
      // Gửi thông báo share_post/////////////////////////////////////////////////////////////////////
      const userIdOfPost = await axios.get(`/api/posts/userid/${postId}`);
      await sendNotification(user?.userId, userIdOfPost.data, 'share_post', postId);
      setTimeout(() => setShowToast(false), 2000);      // Ẩn thông báo sau 2s
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  // Chỉnh sửa bài viết
  const handleEditSubmit = async (formData) => {
    try {
      //console.log("form data: ", formData);
      const data = await editPost(post.postId, formData.description, editedFile, removedOldMedia);
      //console.log("Dataaa: ", data);
      dispatch(updatePost(data));
      setIsEditing(false);
    } catch (error) {
      alert("Lỗi khi cập nhật: " + error.message);
    }
  };

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        alert("File quá lớn! Vui lòng chọn file nhỏ hơn 10MB.");
        setEditedFile(null); // Không lưu file để không preview
        return;
      }
      setEditedFile(selectedFile);
    }
  };
  

  const handleLikeComment = async (postId, commentId, userId) => {
    try {
      dispatch(toggleLikeCommentState({ postId, commentId, userId }));
      await toggleLikeCommentAPI(commentId, userId);
      //////gửi thông báo like comment//////////////////////////////////////////////
      const LikePostID = await axios.get(`/api/likes/last/${userId}`);
      const userIdOfComment = await axios.get(`/api/comments/userid/${commentId}`);
      await sendNotification(userId, userIdOfComment.data, 'like_comment', LikePostID.data);
    }
    catch (err) {
      dispatch(toggleLikeCommentState({ postId, userId: userId }));
      console.error("Like failed: ", err);
    }
  }
  

  //console.log("post.user:", post.user);
  //console.log("post hiện tịa: ", post);
  //console.log("post.user.userId: ", post.user.userId);
  return (
    <div className='mb-2 bg-primary p-4 rounded-xl'>
      {/* Phần header */}
      <div className='flex gap-3 items-center mb-2 relative'>
        {}
        
        {/* Phần avatar và username */}
        {console.log("post.user: ", post.user)}
        <Link to={`/profile/${post?.user?.userId}`}>
          <img
            src={post?.user?.profileImage || NoProfile}
            alt={post?.user?.username}
            className='w-14 h-14 object-cover rounded-full'
          />
        </Link>

        <div className='w-full flex justify-between'>
          <div>
            <Link to={`/profile/${post?.user.userId}`}>
              <p className='font-medium text-lg text-ascent-1'>
                {post?.user?.username}
              </p>
            </Link>
            <span className='text-ascent-2'>{post?.country}</span>
          </div>

          {/* Phần thời gian và nút menu */}
          <div className='flex items-center gap-2'>
            <span className='text-ascent-2'>
              {moment(post.timestamp).fromNow()}
            </span>

            {isPostAuthor && (
              <div className="flex items-center">
                {/* Nút 3 chấm */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <BiDotsVerticalRounded
                    size={20}
                    className="text-gray-500 dark:text-gray-400"
                  />
                </button>

                {/* Dropdown menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 w-40 z-10">
                    <button
                      onClick={() => {
                        // handleEditSubmit();
                        setIsEditing(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <MdEdit size={18} />
                      <span>Chỉnh sửa</span>
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(post.postId);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 dark:text-red-400"
                    >
                      <MdDelete size={18} />
                      <span>Xóa</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nội dung bài viết */}
      <div className={`${isEditing ? 'blur-sm' : ''}`}>
        <p className='text-ascent-2'>
          {showAll ? post?.content : post?.content?.slice(0, 100)}
          {post?.content?.length > 100 && (
            <span
              className='text-blue ml-2 font-medium cursor-pointer'
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less" : "...Show More"}
            </span>
          )}
        </p>
        {post?.mediaURL && (
          post.mediaURL.endsWith('.mp4') || post.mediaURL.endsWith('.wav') ? (
            <video controls className='w-full mt-2 rounded-lg'>
              <source src={post.mediaURL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={post.mediaURL}
              alt='post media'
              className='w-full mt-2 rounded-lg'
            />
          )
        )}

      </div>

      {/* Actions */}
      <div
        className='mt-4 flex justify-between items-center px-3 py-2 text-ascent-2
      text-base border-t border-[#66666645]'
      >
        {/* Nút Like */}
        <p className='flex gap-2 items-center text-base cursor-pointer' onClick={likePost}>
          {post?.likes?.some(like =>
            like?.user?.userId === user?.userId
          ) ? (
            <BiSolidLike size={20} color='blue' />
          ) : (
            <BiLike size={20} />
          )}
          {post?.likeCount} Likes
        </p>
        {/* Nút Comment */}
        <p
          className='flex gap-2 items-center text-base cursor-pointer'
          onClick={() => {
            handleShowComments();
          }}
        >
          <BiComment size={20} />
          {post?.commentCount} Comments
        </p>
        {/* Nút Share */}
        <p
          className='flex gap-2 items-center text-base cursor-pointer'
          onClick={handleShare}
        >
          <BiShare size={20} />
          <span>Share</span>
        </p>

      </div>
      {/* COMMENTS */}
      {showComments === postId && (
        <div className='w-full mt-4 border-t border-[#66666645] pt-4 '>
          <CommentForm
            user={user}
            id={postId}
          />
          {/* danh sách comment*/}
          {loading ? (
            <Loading />
          ) : comments?.length > 0 ? (
            comments.map((content) => (
              <div className='w-full py-2' key={content?.commentId}>
                <div className='flex gap-3 items-center mb-1'>
                  <Link to={"/profile/" + content?.user?.userId}>
                    <img
                      src={content?.user?.profileImage ?? NoProfile}
                      alt={content?.user?.username}
                      className='w-10 h-10 rounded-full object-cover'
                    />
                  </Link>
                  <div>
                    <Link to={"/profile/" + content?.user?.userId}>
                      <p className='font-medium text-base text-ascent-1'>
                        {content?.user?.username}
                      </p>
                    </Link>
                    <span className='text-ascent-2 text-sm'>
                      {moment(content?.timestamp ?? "2023-05-25").fromNow()}
                    </span>
                  </div>
                </div>

                <div className='ml-12'>
                  <p className='text-ascent-2'>{content?.content}</p>

                  <div className='mt-2 flex gap-6'>
                    <p className='flex gap-2 items-center text-base text-ascent-2 cursor-pointer'
                      onClick={() => handleLikeComment(content.post.postId, content.commentId, user.userId)}>

                      {content.likes.some(like => like.user.userId === user.userId) ? (
                        <BiSolidLike size={20} color='blue' />
                      ) : (
                        <BiLike size={20} />
                      )}
                      {content.likes.length} Likes
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <span className='flex text-sm py-4 text-ascent-2 text-center'>
              No Comments, be first to comment
            </span>
          )}
        </div>
      )}
      {/* Toast notification */}
      {showToast && (
        <div className= "fixed bottom-4 right-4 px-4 py-2 rounded-lg animate-fadeIn bg-white text-black">
          
          Đã sao chép liên kết!
        </div>
      )}
      {/* Modal/Popup chỉnh sửa */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
          <div className="bg-primary rounded-xl p-6 w-full max-w-md mx-4">
            {/* Phần header với avatar và username */}
            <div className="flex gap-3 items-center mb-4">
              <img
                src={post.user?.profileImage || NoProfile}
                alt={post.user?.username}
                className="w-14 h-14 object-cover rounded-full"
              />
              <div className="flex-1">
                <p className="font-medium text-lg text-ascent-1">
                  {post.user?.username}
                </p>
                <span className="text-ascent-2">{post.user?.country}</span>
              </div>
            </div>

            {/* Form chỉnh sửa */}
            <form onSubmit={handleSubmit(handleEditSubmit)} className="space-y-4">
              <TextInput
                styles="w-full rounded-full py-5"
                name='description'
                register={register("description", {
                  required: "Không để trống mô tả",
                  // onChange: (e) => { setValue("description", e.target.value);}
                })}
                error={errors.description?.message}
              />
              {editedFile ? (
                <div className="relative w-full mt-2">
                  {editedFile.type.startsWith("video/") ? (
                    <video key={URL.createObjectURL(editedFile)}  controls className="w-full rounded-lg">
                      <source src={URL.createObjectURL(editedFile)} type={editedFile.type} />
                    </video>
                  ) : (
                    <img
                      src={URL.createObjectURL(editedFile)}
                      alt="preview"
                      className="w-full rounded-lg"
                    />
                  )}
                  {/* Nút xoá */}
                  <button
                    type="button"
                    onClick={() => setEditedFile(null)}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black"
                  >
                    <BiSolidXCircle color="black" size={20} />

                  </button>
                </div>
              ) : post.mediaURL && !removedOldMedia ? (
                <div className="relative w-full mt-2">
                  {post.mediaURL.endsWith(".mp4") || post.mediaURL.endsWith(".wav") ? (
                    <video controls className="w-full rounded-lg">
                      <source src={post.mediaURL} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={post.mediaURL}
                      alt="post media"
                      className="w-full rounded-lg"
                    />
                  )}
                  {/* Nút xoá media cũ nếu muốn xoá luôn */}
                  <button
                    type="button"
                    onClick={() => {
                      setRemovedOldMedia(true);
                      setEditedFile(null);
                    }}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black"
                  >
                    <BiSolidXCircle color="black" size={20} />
                  </button>
                </div>
              ) : null}


              {/* Các nút upload */}
              <div className="flex justify-between py-2">
                <label className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer">
                  <BiImages />
                  <span>Image</span>
                  <input
                    type="file"
                    className="hidden"
                    id="imgUpload"
                    accept=".jpg,.png,.jpeg"
                    onChange={handleFileChange}
                  />
                </label>

                <label className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer">
                  <BiSolidVideo />
                  <span>Video</span>
                  <input
                    type="file"
                    className="hidden"
                    id="videoUpload"
                    accept=".mp4,.wav"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {/* Nút submit */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-ascent-1 hover:text-ascent-2"
                >
                  Hủy
                </button>
                <CustomButton
                  type="submit"
                  title="Lưu thay đổi"
                  containerStyles="bg-[#0444a4] text-white py-2 px-6 rounded-full font-semibold text-sm"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
};

export default PostCard;
