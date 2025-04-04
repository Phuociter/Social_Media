/**
 * Form/index.jsx - Trang tạo mới người dùng
 * 
 * Chức năng:
 * - Form tạo mới thông tin người dùng
 * - Các trường thông tin:
 *   + Họ
 *   + Tên
 *   + Email
 *   + Số điện thoại
 * - Sử dụng Formik để quản lý form
 * - Sử dụng Yup để validate dữ liệu
 * - Responsive trên các thiết bị di động
 */

import { Box, Button, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography, IconButton } from "@mui/material";  
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../component/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import axios from "axios";
import { useState, useEffect } from "react";
  const PostManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [posts, setPosts] = useState([]);
  //Lấy danh sách bài viết
  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/posts", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  //Sử dụng useEffect để lấy danh sách bài viết
  useEffect(() => {
    fetchPosts();
  }, []);
  const handleEdit = (postId) => {
    console.log(postId);
  };
  const handleDelete = (postId) => {
    console.log(postId);
  };      
  

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý bài viết
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <TextField
          label="Tìm theo tên"
          variant="outlined"
          size="small"
          sx={{ width: 200 }}
        />
        <TextField
          label="Tìm theo media type"
          variant="outlined"
          size="small"
          sx={{ width: 200 }}
        />
        <FormControl size="small" sx={{ width: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select label="Status">
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
          </Select>
        </FormControl>
      </Box>
     
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow >
              <TableCell>ID</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Media Type</TableCell>
              <TableCell>Media URL</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody  >
            {posts.map((post) => (
              <TableRow key={post.postId}>
                <TableCell>{post.postId}</TableCell>
                <TableCell>{post.content}</TableCell>
                <TableCell>{post.mediaType}</TableCell>
                <TableCell>{post.mediaURL}</TableCell>
                <TableCell>{post.status}</TableCell>
                <TableCell >
                    <IconButton onClick={() => handleEdit(post.postId)} color="blue" aria-label="edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(post.postId)} color="error" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
              </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PostManagement;  
