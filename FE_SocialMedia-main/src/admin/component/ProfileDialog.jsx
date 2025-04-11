import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  Avatar, 
  Grid, 
  Paper, 
  Divider 
} from '@mui/material';

const ProfileDialog = ({ open, onClose }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  //Khai báo theme và màu sắc
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  //Hiển thị hồ sơ người dùng
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
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h5" component="div">
          Hồ sơ người dùng
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Phần thông tin cá nhân */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
              <Avatar
                src={user?.profileImage}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              <Typography variant="h6">{user?.username}</Typography>
              <Typography color="textSecondary">{user?.email}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Vai trò: {user?.role}
              </Typography>
            </Box>  
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin tài khoản
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography color="textSecondary">Giới thiệu:</Typography>
                  <Typography>{user?.bio}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="textSecondary">Quốc tịch:</Typography>
                  <Typography>{user?.country}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileDialog; 