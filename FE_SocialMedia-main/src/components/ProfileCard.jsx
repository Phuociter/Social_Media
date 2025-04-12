import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LiaEditSolid } from "react-icons/lia";
import { useParams } from "react-router-dom";
import {
  BsBriefcase,
  BsFacebook,
  BsInstagram,
  BsPersonFillAdd,
} from "react-icons/bs";
import { FaTwitterSquare } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import moment from "moment";
import { NoProfile } from "../assets";
import { sendFriendRequest,
  acceptFriendRequest,
  denyFriendRequest,
  unfriend,
  getFriendStatus,} from "../api/FriendAPI";

const ProfileCard = ({ user }) => {
  const { id } = useParams();
  const { user: currentUser, edit } = useSelector((state) => state.user); // currentUser là người đang đăng nhập
  const [friendStatus, setFriendStatus] = useState(null); // State lưu trạng thái kết bạn
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Xử lý khi nhấn vào "Edit Profile"
  const handleEditClick = () => {
    navigate("/edit-profile");
  };


{/*useEffect(() => {
  if (currentUser && user) {
    const fetchFriendshipInfo = async () => {
      try {
        const response = await getFriendStatus(currentUser.userId, user.userId);
        // Giả sử response.data chứa toàn bộ thông tin của friendship
        setFriendStatus(response.data);
      } catch (error) {
        console.error("Failed to fetch friend status", error);
      }
    };
    fetchFriendshipInfo();
  }
}, [currentUser, user]);*/}

const checkFriendStatus = async () => {
  try {
    const result = await getFriendStatus(currentUser?.userId, user?.userId);
    console.log("Friend Status Result:", result);
    setFriendStatus(result);
  } catch (error) {
    console.error("Lỗi khi gọi API friend status:", error);
  }
};

// Gọi hàm khi cần, ví dụ trong useEffect
useEffect(() => {
  if (currentUser?.userId && user?.userId) {
    checkFriendStatus();
  } else {
    console.log("Đang chờ user được load...");
  }
}, [currentUser, user]);


  const handleFriendRequest = async () => {
    try {
      if (!currentUser?.userId || !user?.userId) return;
      const response = await sendFriendRequest(currentUser.userId, user.userId);
      alert("Friend request sent!");
      const newStatus = {
        status: "pending",
        senderId: currentUser?.userId,
        receiverId: user?.userId,
        requestId: response.requestId || null,
      };
  
      setFriendStatus(newStatus);
      localStorage.setItem("friendStatus", JSON.stringify(newStatus));
      
    } catch (error) {
      console.error("Failed to send friend request:", error);
      alert("Failed to send friend request!");
    }
  };

  const handleAcceptFriendRequest = async () => {
    try {
      if (!friendStatus?.requestId) return;
      const response = await acceptFriendRequest(friendStatus.requestId);
      alert("Friend request accepted!");
      setFriendStatus({ ...friendStatus, status: "accepted" }); // Cập nhật lại trạng thái
      const updatedStatus = {
        status: "accepted",
        senderId: friendStatus?.senderId,
        receiverId: friendStatus?.receiverId,
        requestId: null,
      };
    } catch (error) {
      console.error("Failed to accept friend request", error);
    }
  };

  const handleDenyFriendRequest = async () => {
    try {
      if (!friendStatus?.requestId) return;
      const response = await denyFriendRequest(friendStatus.requestId);
      alert("Friend request denied!");
      setFriendStatus(null); // Xóa trạng thái lời mời kết bạn
      localStorage.removeItem("friendStatus");

    } catch (error) {
      console.error("Failed to deny friend request", error);
    }
  };

  const handleUnfriend = async () => {
    try {
      if (!currentUser?.userId || !user?.userId) return;
      const response = await unfriend(currentUser.userId, user.userId);
      alert("Unfriended!");
      setFriendStatus(null); // Xóa trạng thái bạn bè
      localStorage.removeItem("friendStatus");

    } catch (error) {
      console.error("Failed to unfriend", error);
    }
  };

  // Logic hiển thị nút
  const renderActionButton = () => {
    // Nếu đang xem trang cá nhân của mình
    if (currentUser?.userId === user?.userId) {
      return (
        <LiaEditSolid
          size={22}
          className="text-blue cursor-pointer"
          onClick={handleEditClick}
        />
      );
    }
    
    // Nếu đã là bạn bè
    if (friendStatus && friendStatus.status === "accepted") {
      return (
        <div>
          <span className="text-green-500 font-medium">Bạn bè</span>
          <button 
            onClick={handleUnfriend} 
            className="bg-red-500 text-white px-2 py-1 rounded ml-2">
            Hủy kết bạn
          </button>
        </div>
      );
    }

    // Nếu lời mời đang chờ (pending)
    if (friendStatus && friendStatus.status === "pending") {
      // Nếu currentUser là người đã gửi lời mời
      if (friendStatus.senderId === currentUser.userId) {
        return (
          <button
            //onClick={()}
            className="bg-yellow-500 text-white px-2 py-1 rounded">
            Hủy lời mời
          </button>
        );
      } else {
        // Nghĩa là currentUser được nhận lời mời từ người khác
        return (
          <div>
            <button
              onClick={handleAcceptFriendRequest}
              className="bg-green-500 text-white px-2 py-1 rounded">
              Accept
            </button>
            <button
              onClick={handleDenyFriendRequest}
              className="bg-red-500 text-white px-2 py-1 rounded ml-2">
              Deny
            </button>
          </div>
        );
      }
    }
    
    // Nếu chưa có lời mời nào (friendStatus === null)
    return (
       <button
      className="bg-[#0444a430] text-sm text-white p-1 rounded"
      onClick={handleFriendRequest}
    >
      <BsPersonFillAdd size={20} className="text-[#0f52b6]" />
    </button>
    );
  };

  return (
    <div>
      <div className="w-full bg-primary flex flex-col items-center shadow-sm rounded-xl px-6 py-4 ">
        <div className="w-full flex items-center justify-between border-b pb-5 border-[#66666645]">
          <Link to={"/profile/" + user?.userId} className="flex gap-2">
            <img
              src={user?.profileImage ?? NoProfile}
              alt={user?.email}
              className="w-14 h-14 object-cover rounded-full"
            />

            <div className="flex flex-col justify-center">
              <p className="text-lg font-medium text-ascent-1">
                {user?.username ?? "No name"}
              </p>
              <span className="text-ascent-2">
                {user?.profession ?? "No Profession"}
              </span>
            </div>
          </Link>

          <div className="">
          {renderActionButton()}
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 py-4 border-b border-[#66666645]">
          <div className="flex gap-2 items-center text-ascent-2">
            <CiLocationOn className="text-xl text-ascent-1" />
            <span>{user?.country ?? "Add country"}</span>
          </div>

          <div className="flex gap-2 items-center text-ascent-2">
            <BsBriefcase className=" text-lg text-ascent-1" />
            <span>{user?.profession ?? "Add Profession"}</span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 py-4 border-b border-[#66666645]">
      
          <div className="flex items-center justify-between">
            <span className="text-ascent-2">Joined</span>
            <span className="text-ascent-1 text-base">
              {moment(user?.createdAt).fromNow()}
            </span>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default ProfileCard;
