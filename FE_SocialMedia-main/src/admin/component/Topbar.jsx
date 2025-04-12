/**
 * Topbar.jsx - Component thanh điều hướng phía trên
 * 
 * Chức năng:
 * - Thanh tìm kiếm
 * - Chuyển đổi chế độ sáng/tối
 * - Hiển thị thông báo
 * - Cài đặt
 * - Thông tin người dùng
 */

import { Box, IconButton, useTheme, InputBase, Menu, MenuItem, Badge } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";  
import { useNavigate } from "react-router-dom"; 
import ProfileDialog from "./ProfileDialog";

const Topbar = ({ setIsSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatar: '',
    role: '',
    joinDate: '',
    lastLogin: '',
    totalPosts: 0,
    approvedPosts: 0,
    rejectedPosts: 0
  });
  const navigate = useNavigate();
  
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenProfile = () => {
    // Lấy dữ liệu người dùng từ localStorage
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    
    // Cập nhật dữ liệu hồ sơ
    setProfileData({
      name: userData.name || 'Người dùng',
      email: userData.email || 'email@example.com',
      avatar: userData.avatar || 'https://via.placeholder.com/150',
      role: userData.role || 'Admin',
      joinDate: userData.joinDate || new Date().toLocaleDateString(),
      lastLogin: userData.lastLogin || new Date().toLocaleDateString(),
      totalPosts: 0, // Có thể cập nhật sau khi lấy dữ liệu từ API
      approvedPosts: 0,
      rejectedPosts: 0
    });
    
    // Mở dialog hồ sơ
    setOpenProfileDialog(true);
    // Đóng menu
    handleClose();
  };

  const handleCloseProfile = () => {
    setOpenProfileDialog(false);
  };

  const logout = () => {
    localStorage.removeItem('user');

    navigate("/login");
    window.location.reload(); // Tải lại trang để cập nhật trạng thái người dùng
  };
  
  return (
    <Box 
      display="flex" 
      justifyContent="space-between" 
      alignItems="center"
      p={2}
      height="64px"
    >
      {/* TOGGLE SIDEBAR */}
      <IconButton 
        onClick={() => setIsSidebar(prev => !prev)}
        sx={{ 
          '&:hover': {
            backgroundColor: colors.primary[400]
          }
        }}
      >
        <MenuOutlinedIcon />
      </IconButton>

      

      {/* ICONS */}
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton 
          onClick={colorMode.toggleColorMode}
          sx={{ 
            '&:hover': {
              backgroundColor: colors.primary[400]
            }
          }}
        >
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

        {/* <IconButton
          onClick={handleNotificationsClick}
          sx={{ 
            '&:hover': {
              backgroundColor: colors.primary[400]
            }
          }}
        >
          {/* <Badge badgeContent={3} color="error">
            <NotificationsOutlinedIcon />
          </Badge> */}
        {/* </IconButton> */}

        <IconButton
          onClick={handleMenuClick}
          sx={{ 
            '&:hover': {
              backgroundColor: colors.primary[400]
            }
          }}
        >
          <PersonOutlinedIcon />
          <KeyboardArrowDownIcon />
        </IconButton>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleOpenProfile}>Hồ sơ</MenuItem>
          <MenuItem onClick={logout}>Đăng xuất</MenuItem>
        </Menu>

        {/* Profile Dialog */}
        <ProfileDialog 
          open={openProfileDialog} 
          onClose={handleCloseProfile} 
          profileData={profileData} 
        />

        {/* Notifications Menu */}
        {/* <Menu
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Thông báo 1</MenuItem>
          <MenuItem onClick={handleClose}>Thông báo 2</MenuItem>
          <MenuItem onClick={handleClose}>Thông báo 3</MenuItem>
        </Menu> */}
      </Box>
    </Box>
  );
};

export default Topbar;
