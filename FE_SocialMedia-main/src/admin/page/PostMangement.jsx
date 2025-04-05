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
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchParams, setSearchParams] = useState({
    name: '',
    mediaType: '',
    status: 'all'
  }); 

  // Lấy danh sách bài viết từ API
  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/posts", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setPosts(response.data);
      setFilteredPosts(response.data); // Khởi tạo filteredPosts ban đầu
    } catch (error) {
      console.log(error);
    }
  };

  // API tìm kiếm bài viết
  const searchPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/posts?name=${searchParams.name}&mediaType=${searchParams.mediaType}&status=${searchParams.status}`
      );
      setPosts(response.data);
      setFilteredPosts(response.data);
    } catch (error) {
      console.log(error);                     
    } 
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [searchParams, posts]);

  const handleEdit = (postId) => {
    console.log(postId);
  };

  const handleDelete = (postId) => {
    console.log(postId);
  };      
  
  // Lọc bài viết theo điều kiện tìm kiếm
  const filterPosts = () => { 
    let filtered = [...posts];

    if (searchParams.name) {
      filtered = filtered.filter(post => 
        post.content.toLowerCase().includes(searchParams.name.toLowerCase())
      );
    }

    if (searchParams.mediaType) {
      filtered = filtered.filter(post => 
        post.mediaType.toLowerCase() === searchParams.mediaType.toLowerCase()
      );
    }

    if (searchParams.status !== 'all') {
      filtered = filtered.filter(post => 
        post.status.toLowerCase() === searchParams.status.toLowerCase()
      );
    }

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

  // Xử lý tìm kiếm
  const handleSearch = () => {
    searchPosts();
  };  

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
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="image">Hình ảnh</MenuItem>
            <MenuItem value="video">Video</MenuItem>
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
            <MenuItem value="all">Tất cả</MenuItem>  
            <MenuItem value="pending">Chờ duyệt</MenuItem>
            <MenuItem value="approved">Đã duyệt</MenuItem>
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
                <TableCell>{post.status}</TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => handleEdit(post.postId)} 
                    color="primary" 
                    aria-label="edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(post.postId)} 
                    color="error" 
                    aria-label="delete"
                  >
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
