/**
 * PostManagement.jsx - Trang quản lý bài viết
 * 
 * Chức năng:
 * - Hiển thị danh sách bài viết
 * - Tìm kiếm và lọc bài viết theo:
 *   + Nội dung
 *   + Loại media
 *   + Trạng thái
 * - Chỉnh sửa và xóa bài viết
 */

import { Box, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography, IconButton, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, MenuItem, Button, DialogActions    } from "@mui/material";  
import EditIcon from "@mui/icons-material/Edit";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import { useState, useEffect } from "react";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LockIcon from '@mui/icons-material/Lock';
import axios from "axios";
//Trang quản lý bài viết
const PostManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [posts, setPosts] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchParams, setSearchParams] = useState({
    name: '',
    mediaType: '',
    status: 'all'
  }); 
  // Lấy danh sách bài viết từ API
  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/posts", {
       
      });
      setPosts(response.data);
      setFilteredPosts(response.data); // Khởi tạo filteredPosts ban đầu
    } catch (error) {
      console.log(error);
    }
  };
  //Lấy danh sách bài viết
  useEffect(() => {
    fetchPosts();
  }, []);
  //Lọc bài viết theo điều kiện tìm kiếm
  useEffect(() => {
    filterPosts();
  }, [searchParams, posts]);  
  //Khởi tạo dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    postId: null,
    content: '',
    mediaType: '',  
    mediaURL: '',
    timestamp: '',
    status: ''
  });
  //Cập nhật bài viết
  const handleSubmit = async () => {
    if (!formData.postId || isNaN(formData.postId)) {
      console.log("ID bài viết không hợp lệ");
      showSnackbar('ID bài viết không hợp lệ', 'error');
      return;
    }
  
    const post = {
      postId: parseInt(formData.postId),
      content: formData.content,
      mediaType: formData.mediaType,
      mediaURL: formData.mediaURL,
      timestamp: formData.timestamp,
      status: formData.status ? formData.status.valueOf() : '',
    };
  
    try {
      const response = await axios.put(`http://localhost:8080/api/admin/posts/${post.postId}/update`, post);
  
      if (response.status === 200) {
        fetchPosts();
        handleCloseDialog();
        showSnackbar('Cập nhật trạng thái bài viết thành công', 'success');
      }
    } catch (error) {
      console.error(error);
      showSnackbar('Đã xảy ra lỗi khi cập nhật bài viết', 'error');
    }
  };
  
  //Đóng dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      postId: null,
      content: '',
      mediaType: '',
      mediaURL: '',
      timestamp: '',
      status: ''
    });
  };
  //Mở dialog
  const handleOpenDialog = (post) => {
    setOpenDialog(true);
    setFormData({
      postId: post.postId,
      content: post.content || '',
      mediaType: post.mediaType || '',
      mediaURL: post.mediaURL || '',
      timestamp: post.timestamp || '',
      status: post.status || ''
    });
  };  
  // Hàm hiển thị thông báo
  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Hàm đóng thông báo
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });  
  };
  //Thay đổi giá trị tìm kiếm
  const handleChange = (e) => { 
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Lọc bài viết theo điều kiện tìm kiếm
  const filterPosts = () => { 
    let filtered = [...posts];
    //Lọc bài viết theo nội dung
    if (searchParams.name) {
      filtered = filtered.filter(post => 
        post.content && post.content.toLowerCase().includes(searchParams.name.toLowerCase())
      );
    }
    //Lọc bài viết theo loại media
    if (searchParams.mediaType) {
      filtered = filtered.filter(post => 
        post.mediaType && post.mediaType.toLowerCase() === searchParams.mediaType.toLowerCase()
      );
    }
    //Lọc bài viết theo trạng thái
    if (searchParams.status !== 'all') {
      filtered = filtered.filter(post => 
        post.status && post.status.toLowerCase() === searchParams.status.toLowerCase()
      );
    }
    //Cập nhật danh sách bài viết đã lọc
    setFilteredPosts(filtered); 
  };

  // Xử lý thay đổi giá trị tìm kiếm
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  //Khóa bài viết
  const handleBlockPost = async (postId) => {
    try {
      const post = posts.find(p => p.postId === postId);
      if (!post) {
        console.log("Không tìm thấy bài viết");
        return;
      }
      const postData = {
        status: 'rejected'
      };
      // Sử dụng POST thay vì PUT để cập nhật trạng thái bài viết
      const response = await axios.put(`http://localhost:8080/api/admin/posts/${postId}/update`, postData);
      if (response.status === 200) {
        fetchPosts();
      }
    } catch (error) {
      console.log(error);
    }
  };  
  //Mở bài viết
  const handleUnblockPost = async (postId) => {
    try {
      const post = posts.find(p => p.postId === postId);
      if (!post) {
        console.log("Không tìm thấy bài viết");
        return;
      }
      const postData = {
        postId: postId, 
        content: post.content,
        mediaType: post.mediaType,
        mediaURL: post.mediaURL,
        status: 'approved'
      };
      // Sử dụng POST thay vì PUT để cập nhật trạng thái bài viết
      const response = await axios.put(`http://localhost:8080/api/admin/posts/${postId}/update`, postData);
      if (response.status === 200) {
        fetchPosts();
      }
    } catch (error) {
      console.log(error);
    }
  };  
  //Hiển thị danh sách bài viết
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý bài viết
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2  }}>
        <TextField
          name="name"
          label="Tìm theo nội dung" 
          variant="outlined"
          size="small"
          sx={{ width: 200 }}
          value={searchParams.name}
          onChange={handleSearchChange}
        />

        <FormControl size="small" sx={{ width: 200 }}>
          <InputLabel>Loại media</InputLabel>
          <Select
            name="mediaType"
            label="Loại media"
            value={searchParams.mediaType}
            onChange={handleSearchChange} 
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="image">image</MenuItem>
            <MenuItem value="video">video</MenuItem>    
            <MenuItem value="text">text</MenuItem>
          </Select>
        </FormControl>  

        <FormControl size="small" sx={{ width: 200 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select 
            name="status"
            label="Trạng thái"
            value={searchParams.status}
            onChange={handleSearchChange}
          >
            <MenuItem value="all">All</MenuItem>  
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>  
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>

      </Box>
     
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Loại media</TableCell>
              <TableCell>URL media</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPosts.map((post) => (
              <TableRow key={post.postId}>  
                <TableCell>{post.postId}</TableCell>
                <TableCell>{post.content}</TableCell>
                <TableCell>{post.mediaType}</TableCell>
                <TableCell>{post.mediaURL}</TableCell>
                <TableCell>{post.timestamp}</TableCell>
                <TableCell>{post.status}</TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => handleOpenDialog(post)} 
                    color="action"  
                    aria-label="edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                  onClick={() => {
                    const isBlocked = post.status && post.status.toLowerCase() === "rejected";

                    const confirmMessage = isBlocked
                      ? "Bạn có chắc chắn muốn **mở khóa** bài viết này không?"
                      : "Bạn có chắc chắn muốn **khóa** bài viết này không?";

                    if (window.confirm(confirmMessage)) {
                      if (isBlocked) {
                        handleUnblockPost(post.postId);
                        showSnackbar("Mở bài viết thành công", "success");
                      } else {
                        handleBlockPost(post.postId);
                        showSnackbar("Khóa bài viết thành công", "success");
                      }
                    }
                  }}
                  color="error"
                  aria-label="block"
                >
                  {post.status === "approved" ? (
                    <LockOpenIcon color="success" />
                  ) : post.status === "pending" ? (
                    <HourglassEmptyIcon sx={{ color: "orange" }} />
                  ) : (
                    <LockIcon color="error" />
                  )}
                </IconButton>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>  
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog} sx={{ padding: 2  }}>
        <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
        <DialogContent>
            <TextField  
              sx={{ marginBottom: 2, marginTop: 2 }}
              label="Nội dung"
              name="content"
              value={formData.content}
              onChange={handleChange} 
              fullWidth 
            />
          <TextField
            sx={{ marginBottom: 2, marginTop: 2 }}
            label="Loại media"
            name="mediaType"
            value={formData.mediaType}
            onChange={handleChange} 
            fullWidth
          />
          <TextField 
            sx={{ marginBottom: 2, marginTop: 2  }}
            label="URL media"
            name="mediaURL"
            value={formData.mediaURL}
            onChange={handleChange} 
            fullWidth 
          />
          <TextField
            sx={{ marginBottom: 2, marginTop: 2 }}
            label="Thời gian"
            name="timestamp"
            value={formData.timestamp}
            onChange={handleChange}
            fullWidth
          />
          <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 2 }}>
            <InputLabel id="status-label">Trạng thái</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Trạng thái"
            >
              <MenuItem value="pending">Chờ duyệt</MenuItem>
              <MenuItem value="approved">Đã duyệt</MenuItem>
              <MenuItem value="rejected">Từ chối</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>  
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
          <Button onClick={handleSubmit}color="primary">Cập nhật </Button>
          

        </DialogActions>
      </Dialog >
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PostManagement;
