import React from "react";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { CustomButton } from "../components";

const UserItem = ({ user }) => {
    if (!user) return null;

    return (
        <div className="flex items-center justify-between p-2 hover:bg-[#f0f0f0] rounded-md">
            <Link to={"/profile/" + user?.userId} className="flex gap-3 items-center">
                <img
                    src={user?.profileImage ?? NoProfile}
                    alt={user?.username}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                    <p className="font-medium text-white">{user?.profession}</p> {/* Thêm class text-white */}
                    <p className="text-sm text-gray-500 bg-primary p-4 rounded-lg text-white">{user?.country ?? "Chưa cập nhật"}</p>
                </div>
            </Link>
            <Link to={"/profile/" + user?.userId} className="flex gap-2">
                <CustomButton
                    title="Go to Profile"
                    containerStyles="bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full"
                />
            </Link>
        </div>
    );
};

export default UserItem;
