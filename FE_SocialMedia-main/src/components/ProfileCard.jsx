import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LiaEditSolid } from "react-icons/lia";

import {
  BsBriefcase,
  BsPersonFillAdd,
} from "react-icons/bs";
import { CustomButton } from "../components";
import { CiLocationOn } from "react-icons/ci";
import moment from "moment";
import { NoProfile } from "../assets";
import {
  sendFriendRequest,
  acceptFriendRequest,
  denyFriendRequest,
  unfriend,
  getFriendStatus,
  deleteFriendRequest,
} from "../api/FriendAPI";
import { UpdateProfile } from "../redux/userSlice";

const ProfileCard = ({ user }) => {
  const { user: currentUser, edit } = useSelector((state) => state.user); // currentUser là người đang đăng nhập
  const [friendStatus, setFriendStatus] = useState(null); // State lưu trạng thái kết bạn
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Xử lý khi nhấn vào "Edit Profile"
  const handleEditClick = () => {
    navigate("/edit-profile");
  };


  const checkFriendStatus = async () => {
    try {
      const result = await getFriendStatus(currentUser?.userId, user?.userId);
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


  //ham gui loi moi ket ban
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

      console.log("newstatus", newStatus)
      setFriendStatus(newStatus);
      localStorage.setItem("friendStatus", JSON.stringify(newStatus));

    } catch (error) {
      console.error("Failed to send friend request:", error);
      alert("Failed to send friend request!");
    }
  };


  //ham dong y loi moi ket ban
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
        requestId: response.requestId || null,
      };
      setFriendStatus(updatedStatus);
      localStorage.setItem("friendStatus", JSON.stringify(updatedStatus));
    } catch (error) {
      console.error("Failed to accept friend request", error);
    }
  };

  //ham tu choi loi moi ket ban
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

  //ham unfriend
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

  const handleCancel = async () => {
    try {
      if (!currentUser?.userId || !user?.userId) return;
      const response = await denyFriendRequest(friendStatus.requestId);
      alert("Cancel Request!!!");
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

          <CustomButton
            title='Unfriend'
            containerStyles='bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full'
            onClick={handleUnfriend}
          />
        </div>
      );
    }

    // Nếu lời mời đang chờ (pending)
    if (friendStatus && friendStatus.status === "pending") {
      // Nếu currentUser là người đã gửi lời mời
      if (friendStatus.senderId === currentUser.userId) {
        return (

          <CustomButton
            title='Cancel request'
            containerStyles='bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full'
            onClick={handleCancel}
          />

        );
      } else {
        // Nghĩa là currentUser được nhận lời mời từ người khác
        return (
          <div>
            <CustomButton
              title='Accept'
              containerStyles='bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full'
              onClick={handleAcceptFriendRequest}
            />
            <CustomButton
              title='Deny'
              containerStyles='border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full'
              onClick={handleDenyFriendRequest}
            />
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
