import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LiaEditSolid } from "react-icons/lia";
import { BsBriefcase, BsPersonFillAdd } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import moment from "moment";
import { NoProfile } from "../assets";
import { CustomButton } from "../components";
import {
  sendFriendRequest,
  acceptFriendRequest,
  denyFriendRequest,
  unfriend,
  getFriendStatus,
  deleteFriendRequest,
} from "../api/FriendAPI";
import { UpdateProfile } from "../redux/userSlice";
import { sendNotification } from "../api/NotificationsAPI";
import axios from "axios";
//user = chủ profile
// currentUser = người dùng đang đăng nhập

const ProfileCard = ({ user }) => {
  const { user: currentUser, edit } = useSelector((state) => state.user);
  const [friendStatus, setFriendStatus] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Hàm kiểm tra trạng thái kết bạn
  const checkFriendStatus = async () => {
    try {
      const result = await getFriendStatus(currentUser?.userId, user?.userId);
      console.log("Friend status: ", result);
      setFriendStatus(result);
      localStorage.setItem("friendStatus", JSON.stringify(result));  // Lưu vào localStorage
    } catch (error) {
      console.error("Lỗi khi gọi API friend status:", error);
    }
  };

  useEffect(() => {
    async function checkStatus() {
      if (currentUser?.userId && user?.userId) {
        localStorage.removeItem("friendStatus");
        const storedStatus = localStorage.getItem("friendStatus");
        if (storedStatus) {
          setFriendStatus(JSON.parse(storedStatus));  // Lấy từ localStorage nếu có
        } else {
          await checkFriendStatus();
        }
      }
    }
    checkStatus();
  }, [currentUser, user]);

  // Các hàm xử lý yêu cầu kết bạn
  const handleFriendRequest = async () => {
    try {
      if (!currentUser?.userId || !user?.userId) return;
      const response = await sendFriendRequest(currentUser.userId, user.userId);
      alert("Friend request sent!");
      
      const newStatus = {
        status: "pending",
        senderId: currentUser.userId,
        receiverId: user.userId,
        requestId: response.requestId || null,
      };
      setFriendStatus(newStatus);
      
      const requestID = await axios.get(`api/friends/requests/last-request-id/${user.userId}&${currentUser.userId}`);
      await sendNotification(currentUser.userId, user.userId, 'friend_request_received', requestID.data);
      localStorage.setItem("friendStatus", JSON.stringify(newStatus));  // Lưu vào localStorage
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
      const updatedStatus = {
        status: "accepted",
        senderId: friendStatus.senderId,
        receiverId: friendStatus.receiverId,
        requestId: response.requestId || null,
      };
      setFriendStatus(updatedStatus);
      localStorage.setItem("friendStatus", JSON.stringify(updatedStatus));  // Lưu vào localStorage
    } catch (error) {
      console.error("Failed to accept friend request", error);
    }
  };

  const handleDenyFriendRequest = async () => {
    try {
      if (!friendStatus?.requestId) return;
      await denyFriendRequest(friendStatus.requestId);
      alert("Friend request denied!");
      setFriendStatus(null);
      localStorage.removeItem("friendStatus");
    } catch (error) {
      console.error("Failed to deny friend request", error);
    }
  };

  const handleCancel = async () => {
    try {
      if (!currentUser?.userId || !user?.userId) return;
      await denyFriendRequest(friendStatus.requestId);
      alert("Cancel Request!!!");
      setFriendStatus(null);
      localStorage.removeItem("friendStatus");
    } catch (error) {
      console.error("Failed to cancel friend request", error);
    }
  };

  const handleUnfriend = async () => {
    try {
      if (!currentUser?.userId || !user?.userId) return;
      await unfriend(currentUser.userId, user.userId);
      alert("Unfriended!");
      setFriendStatus(null);
      localStorage.removeItem("friendStatus");
    } catch (error) {
      console.error("Failed to unfriend", error);
    }
  };

  const renderActionButton = () => {
    if (currentUser?.userId === user?.userId) {
      return (
        <LiaEditSolid
          size={22}
          className="text-blue cursor-pointer"
          onClick={() => navigate("/edit-profile")}
        />
      );
    }

    if (friendStatus && (friendStatus.status === "accepted" || friendStatus.status === "friends")) {
      return (
        <div>
          <span className="text-white font-medium">Bạn bè</span>
          <span className="text-white text-sm opacity-70 ml-4">||</span>
          <CustomButton
            title="Unfriend"
            containerStyles="bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full ml-4"
            onClick={handleUnfriend}
          />
        </div>
      );
    }

    if (friendStatus && friendStatus.status === "pending") {
      if (friendStatus.senderId === currentUser.userId) {
        return (
          <CustomButton
            title="Cancel request"
            containerStyles="bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full"
            onClick={handleCancel}
          />
        );
      } else {
        return (
          <div>
            <CustomButton
              title="Accept"
              containerStyles="bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full"
              onClick={handleAcceptFriendRequest}
            />
            <CustomButton
              title="Deny"
              containerStyles="border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full"
              onClick={handleDenyFriendRequest}
            />
          </div>
        );
      }
    }

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
      <div className="w-full bg-primary flex flex-col items-center shadow-sm rounded-xl px-6 py-4">
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

            </div>
          </Link>
          <div>{renderActionButton()}</div>
        </div>

        <div className="w-full flex flex-col gap-2 py-4 border-b border-[#66666645]">
          <div className="flex gap-2 items-center text-ascent-2">
            <CiLocationOn className="text-xl text-ascent-1" />
            <span>{user?.country ?? "Add country"}</span>
          </div>
          <div className="flex gap-2 items-center text-ascent-2">
            <BsBriefcase className="text-lg text-ascent-1" />
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
