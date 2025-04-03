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

const Topbar = ({ setIsSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
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

      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="8px"
        width="300px"
        alignItems="center"
        px={2}
      >
        <SearchIcon sx={{ color: colors.grey[100], mr: 1 }} />
        <InputBase 
          placeholder="Tìm kiếm..." 
          sx={{ 
            color: colors.grey[100],
            '& .MuiInputBase-input': {
              p: 1,
            }
          }} 
        />
      </Box>

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
          <MenuItem onClick={handleClose}>Hồ sơ</MenuItem>
          <MenuItem onClick={handleClose}>Cài đặt</MenuItem>
          <MenuItem onClick={handleClose}>Đăng xuất</MenuItem>
        </Menu>

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
