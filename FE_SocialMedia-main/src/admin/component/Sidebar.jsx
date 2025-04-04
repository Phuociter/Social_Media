/**
 * Sidebar.jsx - Component menu điều hướng bên trái
 * 
 * Chức năng:
 * - Hiển thị menu điều hướng với các mục:
 *   + Dashboard: Trang tổng quan
 *   + Users: Quản lý người dùng
 *   + Posts: Quản lý bài viết
 * - Có thể thu gọn/mở rộng sidebar
 * - Sử dụng react-pro-sidebar để tạo menu
 */

import { useState } from "react"; 
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";      
import { Link } from "react-router-dom";  
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import axios from "axios";
import { useEffect } from "react";  

/**
 * Component Item - Hiển thị một mục menu đơn lẻ
 * 
 * @param {Object} props - Các thuộc tính của component
 * @param {string} props.title - Tiêu đề của mục menu
 * @param {string} props.to - Đường dẫn chuyển hướng khi click
 * @param {ReactNode} props.icon - Icon hiển thị bên cạnh tiêu đề
 * @param {string} props.selected - Mục menu đang được chọn
 * @param {Function} props.setSelected - Hàm cập nhật mục menu được chọn
 * @returns {JSX.Element} Component MenuItem được tùy chỉnh
 */
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [user, setUser] = useState(null); 
  
  /**
   * Hook useEffect - Lấy thông tin user khi component được mount
   * Gọi API để lấy thông tin user từ server
   */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/users");    
        const data = await response.json();
        setUser(data);  
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

/**
 * Component Sidebar - Thanh điều hướng chính của trang admin
 * 
 * @param {Object} props - Các thuộc tính của component
 * @param {boolean} props.isSidebar - Trạng thái mở rộng/thu gọn của sidebar
 * @returns {JSX.Element} Component Sidebar hoàn chỉnh
 */
const Sidebar = ({ isSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");
  const [user, setUser] = useState(null);
    
  /**
   * Hook useEffect - Lấy thông tin user đang đăng nhập
   * 1. Kiểm tra localStorage trước
   * 2. Nếu không có, gọi API để lấy thông tin
   * 3. Lưu thông tin vào localStorage để sử dụng sau này
   */
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Lấy user đang đăng nhập từ localStorage
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser) {
          setUser(currentUser);
        } else {
          // Nếu không có user trong localStorage, gọi API để lấy thông tin
          const response = await axios.get("http://localhost:8080/api/users/current-user");
          if (response.data) {
            setUser(response.data);
            // Lưu thông tin user vào localStorage
            localStorage.setItem('user', JSON.stringify(response.data));
          }
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  return (
    <Box
      sx={{
        height: '100vh',
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
          height: '100%',
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "8px 35px 8px 20px !important",
          margin: "4px 0 !important",
          borderRadius: "4px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
          backgroundColor: `${colors.primary[500]} !important`,
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
          backgroundColor: `${colors.primary[500]} !important`,
        },
      }}
    >
      <ProSidebar collapsed={!isSidebar} width="100%" height="100%">
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            style={{
              margin: "16px 0 24px 0",
              color: colors.grey[100],
            }}
          >
            {isSidebar && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  ADMINIS
                </Typography>
              </Box>
            )}
          </MenuItem>

          {/* User Profile Section - Hiển thị thông tin user đang đăng nhập */}
          <Box mb="32px">
            <Box display="flex" justifyContent="center" alignItems="center">
              <img
                alt="profile-user"
                width="120px"
                height="120px"
                src={user?.profileimage}     
                style={{ 
                  cursor: "pointer", 
                  borderRadius: "50%",
                  border: `3px solid ${colors.greenAccent[500]}`,
                  padding: "2px"
                }}
              />
            </Box>
            <Box textAlign="center" mt={2}>
              <Typography
                variant="h2"
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{ m: "10px 0 0 0" }}
              >
                {user?.username || 'Admin'} 
              </Typography>
              <Typography variant="h5" color={colors.greenAccent[500]}>
                {user?.role || 'Administrator'}
              </Typography>
            </Box>
          </Box>

          {/* Menu Items - Danh sách các mục menu chính */}
          <Box paddingLeft={isSidebar ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/admin/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "24px 0 8px 20px" }}
            >
              Management
            </Typography>
            <Item
              title="User Management"
              to="/admin/UserManagement"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Post Management"
              to="/admin/PostManagement"
              icon={<ArticleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
