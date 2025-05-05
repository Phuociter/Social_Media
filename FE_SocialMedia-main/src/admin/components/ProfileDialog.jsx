import React from 'react';
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

const ProfileDialog = ({ open, onClose, profileData }) => {
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
                src={profileData.profileImage}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              <Typography variant="h6">{profileData.name}</Typography>
              <Typography color="textSecondary">{profileData.email}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Vai trò: {profileData.role}
              </Typography>
            </Box>
          </Grid>

          {/* Phần thống kê */}
          <Grid item xs={12} md={8}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Thống kê hoạt động
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4">{profileData.totalPosts}</Typography>
                    <Typography color="textSecondary">Tổng bài viết</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4">{profileData.approvedPosts}</Typography>
                    <Typography color="textSecondary">Bài đã duyệt</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4">{profileData.rejectedPosts}</Typography>
                    <Typography color="textSecondary">Bài bị từ chối</Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Thông tin tài khoản
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Ngày tham gia:</Typography>
                  <Typography>{profileData.joinDate}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Đăng nhập cuối:</Typography>
                  <Typography>{profileData.lastLogin}</Typography>
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