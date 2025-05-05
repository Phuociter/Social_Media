import React, { useEffect,useState } from "react";
import { TbSocial } from "react-icons/tb";
import { AiFillMessage } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import TextInput from "./TextInput";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { IoMdNotificationsOutline,IoMdNotifications } from "react-icons/io";
import { SetTheme } from "../redux/theme";
import { Logout } from "../redux/userSlice";
import { CustomButton } from "../components";
import {searchAll} from "../api/SearchAPI"
import axios from "axios";//thêm////////////

const TopBar = ({ onSearch }) => {
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

   // 🔔 State cho dropdown thông báo
  const [openNotify, setOpenNotify] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([ ]);
  // const unreadCount = notifications.filter(n => !n.read).length;
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/notifications/user/${user.userId}`);
      const data = await response.json();
      const contents = [...new Set(data.notifications.map(n => n.content))];
      setNotifications(contents);

      // const contents = data.notifications.map(n => n.content);
      // console.log("Content Array:", contents);
      // setNotifications(contents);
      // xử lý data
    };

    fetchData(); // gọi lần đầu

    const interval = setInterval(fetchData, 1000); // gọi mỗi 5 giây

    return () => clearInterval(interval); // dọn dẹp khi unmount
  }, []);

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";

    dispatch(SetTheme(themeValue));
  };

  const handleSearch = async (data) => {
    try {
      const keyword = data.search?.trim();
      if (!keyword) return;
  
      const result = await searchAll(keyword);
      if (onSearch) {
        onSearch(result); // Gửi kết quả về Home
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  };
  //thêm hàm này để lấy số lượng thông báo chưa đọc
  const fetchUnreadCount = async (userId) => {
    const response = await fetch(`/api/notifications/user/${userId}/unread-count`);
    const count = await response.json();
    setUnreadCount(count);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount(user.userId);
    }, 1000); // 10 giây

    return () => clearInterval(interval); // clear khi component unmount
  }, [user.userId]);

  useEffect(() => {
      const markAllAsRead = async () => {
        try {
          await axios.put(`/api/notifications/user/${user.userId}/read-all`);
          setUnreadCount(0); // Đặt lại số lượng thông báo chưa đọc
          console.log('Đã đánh dấu tất cả là đã đọc');
        } catch (error) {
          console.error('Lỗi khi đánh dấu đã đọc:', error);
        }
      };

      if (openNotify) {
        markAllAsRead();
      }
  },[openNotify]);

  const handleDeleteNotification = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className='topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-primary relative'>
      {/* Logo */}
      <Link to='/' className='flex gap-2 items-center'>
        <div className='p-1 md:p-2 bg-[#065ad8] rounded text-white'>
        <AiFillMessage />        

        </div>
        <span className='text-xl md:text-2xl text-[#065ad8] font-semibold'>
          Bluely
        </span>
      </Link>
{/* Search */}
      <form
        className='hidden md:flex items-center justify-center'
        onSubmit={handleSubmit(handleSearch)}
      >
        <TextInput
          placeholder='Search...'
          styles='w-[18rem] lg:w-[38rem]  rounded-l-full py-3 '
          register={register("search")}
        />
        <CustomButton
          title='Search'
          type='submit'
          containerStyles='bg-[#0444a4] text-white px-6 py-2.5 mt-2 rounded-r-full'
        />
      </form>
       {/* thay đổi bắt đầu từ đây */}
      {/* Icons + Logout */}
      <div className='flex gap-4 items-center bg-black text-white text-md md:text-xl relative'>
        {/* Notification Bell */}
        <div className='hidden lg:flex relative'>
          <button onClick={() => setOpenNotify(!openNotify)} className='relative'>
            {openNotify ? (
              <IoMdNotifications className='text-2xl'  />
            ) : (
              <IoMdNotificationsOutline className='text-2xl' />
            )}
            {unreadCount > 0 && (
              <span className='absolute -top-1 -right-1 bg-black text-[#ff0000]  text-xs w-4 h-4 flex items-center justify-center rounded-full'>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown danh sách thông báo */}
          {openNotify && (
          <div className='absolute right-0 border-b top-10 w-72 text-white rounded shadow-xl'>
            <div className='p-3 bg-[#1a1a1a] border-b font-semibold'>Thông báo</div>
            <ul className='max-h-64 overflow-y-auto'>
              {notifications.map((item, index) => (
                <li
                  key={index}
                  className='flex justify-between items-center px-4 py-2 bg-[#1a1a1a] text-sm hover:text-[#65b0f6] hover:bg-[#2a2a2a]'
                >
                  <span>{item}</span>
                  <button
                    className='text-red-500 hover:underline text-xs ml-2'
                    onClick={() => handleDeleteNotification(index)}
                  >
                    Xóa
                  </button>
                </li>
              ))}
            </ul>
            <div className='text-center bg-[#1a1a1a] text-[#65b0f6] text-sm py-2 cursor-pointer hover:underline'>
              Xem tất cả
            </div>
          </div>
        )}
        </div>
{/* Logout */}
        <div>
          <CustomButton
            onClick={() => dispatch(Logout())}
            title='Log Out'
            containerStyles='text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full'
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
