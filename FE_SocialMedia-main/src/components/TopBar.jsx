import React, { useEffect, useState } from "react";
import { TbSocial } from "react-icons/tb";
import { AiFillMessage } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import TextInput from "./TextInput";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { IoMdNotificationsOutline, IoMdNotifications } from "react-icons/io";
import { SetTheme } from "../redux/theme";
import { Logout } from "../redux/userSlice";
import { CustomButton } from "../components";
import { searchAll } from "../api/SearchAPI";
import axios from "axios";

const TopBar = ({ onSearch }) => {
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openNotify, setOpenNotify] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch(`/api/notifications/user/${user.userId}`);
      const data = await res.json();
      setNotifications(data.notifications.map(n => n.content));
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [user.userId]);

  useEffect(() => {
    const fetchUnread = async () => {
      const res = await fetch(`/api/notifications/user/${user.userId}/unread-count`);
      const count = await res.json();
      setUnreadCount(count);
    };
    fetchUnread();
    const iv = setInterval(fetchUnread, 10000);
    return () => clearInterval(iv);
  }, [user.userId]);

  useEffect(() => {
    if (openNotify) {
      axios.put(`/api/notifications/user/${user.userId}/read-all`)
        .then(() => setUnreadCount(0))
        .catch(console.error);
    }
  }, [openNotify, user.userId]);

  const handleTheme = () => {
    dispatch(SetTheme(theme === "light" ? "dark" : "light"));
  };

  const handleSearch = async (data) => {
    try {
      const keyword = data.search?.trim();
      if (!keyword) return;
      const result = await searchAll(keyword);
      if (onSearch) {
        onSearch(result);
      } else {
        navigate(`/?search=${encodeURIComponent(keyword)}`);
      }
      reset();
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleDeleteNotification = (idx) => {
    setNotifications(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className='topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-primary relative'>
      <Link to='/' className='flex gap-2 items-center'>
        <div className='p-1 md:p-2 bg-[#065ad8] rounded text-white'><AiFillMessage /></div>
        <span className='text-xl md:text-2xl text-[#065ad8] font-semibold'>Bluely</span>
      </Link>

      <form className='hidden md:flex items-center' onSubmit={handleSubmit(handleSearch)}>
        <TextInput
          placeholder='Search...'
          styles='w-[18rem] lg:w-[38rem] rounded-l-full py-3'
          register={register("search")}
        />
        <CustomButton
          title='Search'
          type='submit'
          containerStyles='bg-[#0444a4] text-white px-6 py-2.5 mt-2 rounded-r-full'
        />
      </form>

      <div className='flex gap-4 items-center bg-black text-white text-md md:text-xl relative'>
        <button onClick={() => setOpenNotify(!openNotify)} className='relative hidden lg:block'>
          {openNotify ? <IoMdNotifications className='text-2xl'/> : <IoMdNotificationsOutline className='text-2xl'/>}
          {unreadCount > 0 && <span className='absolute -top-1 -right-1 bg-black text-red-500 text-xs w-4 h-4 flex items-center justify-center rounded-full'>{unreadCount}</span>}
        </button>

        {openNotify && (
          <div className='absolute right-0 top-10 w-72 bg-[#1a1a1a] text-white rounded shadow-xl'>
            <div className='p-3 border-b font-semibold'>Thông báo</div>
            <ul className='max-h-64 overflow-y-auto'>
              {notifications.map((item, i) => (
                <li key={i} className='flex justify-between items-center px-4 py-2 hover:bg-[#2a2a2a]'>
                  <span>{item}</span>
                  <button onClick={() => handleDeleteNotification(i)} className='text-red-500 text-xs'>Xóa</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <CustomButton onClick={() => dispatch(Logout())} title='Log Out' containerStyles='text-sm text-ascent-1 px-4 py-1 border border-[#666] rounded-full' />
      </div>
    </div>
  );
};

export default TopBar;
