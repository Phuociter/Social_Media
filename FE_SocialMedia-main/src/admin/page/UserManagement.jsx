// Import các components cần thiết từ Material-UI và các dependencies khác
import React, { useState, useEffect } from 'react';
import { Box, Typography, TableContainer, Paper, Table, TableHead, TableRow, TableCell, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import { useTheme } from '@mui/material/styles';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/VisibilitySharp';
import axios from 'axios';

const UserManagement = () => {
  const API_URL = 'http://localhost:8080/api/users';
  // Khởi tạo các state cần thiết
  const theme = useTheme(); // Hook để sử dụng theme của MUI
  const [users, setUsers] = useState([]); // State lưu danh sách users
  // Tìm kiếm user theo tên hoặc email và trạng thái
  // Lọc users dựa trên các điều kiện tìm kiếm
  const [searchParams, setSearchParams] = useState({
    name: '',
    email: '',
    status: 'all'
  });
  const [filteredUsers, setFilteredUsers] = useState([]); // State lưu danh sách users đã lọc
  const [openDialog, setOpenDialog] = useState(false); // State kiểm soát việc hiển thị dialog
  const [selectedUser, setSelectedUser] = useState(null); // State lưu user đang được chọn để edit
  const [formData, setFormData] = useState({ // State lưu dữ liệu form
    // id: '',
    username: '',
    email: '',
    role: 'user',
    // password: '',
    status: '',
  });
  const [snackbar, setSnackbar] = useState({ // State quản lý thông báo
    open: false,
    message: '',
    severity: 'success',
  });

  // Hook useEffect để fetch dữ liệu khi component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Hook useEffect để lọc users khi searchParams thay đổi
  useEffect(() => {
    filterUsers();
  }, [searchParams, users]);

  // Hàm lấy danh sách users từ API
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}`);
      setUsers(response.data); // Lấy data từ response
    } catch (error) {
      showSnackbar('Lỗi khi tải danh sách người dùng', 'error');
    }
  };
  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.data; // Parse JSON response
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };
  // Tìm kiếm user theo tên hoặc email và trạng thái
  const searchUsers = async (name, email, status) => {
    try {
      const response = await axios.get(`${API_URL}?name=${name}&email=${email}&status=${status}`);
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  };

  // Cập nhật thông tin user
  const updateUser = async (userId, userData) => {
    try {
      const response = await axios.put(`${API_URL}/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };
  // Hàm mở dialog edit user
  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setFormData({
      id: user.userId,
      username: user.username,
      email: user.email,
      role: user.role || 'user',
      status: user.status,
    });
    setOpenDialog(true);
  };

  // Hàm đóng dialog và reset form
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormData({
      // id: '',
      username: '',
      email: '',
      role: 'user',
      // password: '',
      status: '',
    });
  };

  // Hàm xử lý khi người dùng nhập liệu vào form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm xử lý khi submit form
  const handleSubmit = async () => {
    try {
      if (!selectedUser) {
        showSnackbar('Không tìm thấy user cần cập nhật', 'error');
        return;
      }

      // Kiểm tra username trùng lặp
      const existingUser = users.find(user =>
        user.username === formData.username &&
        user.userId !== selectedUser.userId
      );

      if (existingUser) {
        showSnackbar('Username đã tồn tại', 'error');
        return;
      }

      const userData = {
        id: selectedUser.userId,
        username: formData.username,
        email: formData.email,
        role: formData.role || selectedUser.role || 'user',
        password: selectedUser.password,
        status: formData.status || selectedUser.status
      };

      await updateUser(selectedUser.userId, userData);
      showSnackbar('Cập nhật thông tin người dùng thành công', 'success');
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      showSnackbar('Lỗi khi cập nhật thông tin người dùng', 'error');
      console.error('Error updating user:', error);
    }
  };

  // Hàm xử lý khi xóa user

  // Hàm xử lý khi block user
  const handleBlock = async (userId) => {
    try {
      const user = users.find(u => u.userId === userId);
      if (!user) {
        showSnackbar('Không tìm thấy user', 'error');
        return;
      }
      const userData = {
        id: userId,
        username: user.username,
        email: user.email,
        role: user.role,
        password: user.password,
        status: 'Blocked'
      };
      await updateUser(userId, userData);
      showSnackbar('Block user thành công', 'success');
      fetchUsers(); // Refresh danh sách users
    } catch (error) {
      console.error('Error blocking user:', error);
      showSnackbar('Lỗi khi block user', 'error');
    }
  };
  const handleUnblock = async (userId) => {
    try {
      const user = users.find(u => u.userId === userId);
      if (!user) {
        showSnackbar('Không tìm thấy user', 'error');
        return;
      }

      const userData = {
        id: userId,
        username: user.username,
        email: user.email,
        role: user.role,
        password: user.password,
        status: 'active'
      };

      await updateUser(userId, userData);
      showSnackbar('Unblock user thành công', 'success');
      fetchUsers(); // Refresh danh sách users
    } catch (error) {
      console.error('Error unblocking user:', error);
      showSnackbar('Lỗi khi unblock user', 'error');
    }
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

  // Hàm lọc users dựa trên các điều kiện tìm kiếm
  const filterUsers = () => {
    // Tạo một bản sao của users để lọc
    let filtered = [...users];
    // Lọc users dựa trên tên
    if (searchParams.name) {
      // Lọc users dựa trên tên
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchParams.name.toLowerCase())
      );
    }
    if (searchParams.email) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(searchParams.email.toLowerCase())
      );
    }
    // Lọc users dựa trên trạng thái
    if (searchParams.status !== 'all') {
      filtered = filtered.filter(user =>
        user.status.toLowerCase() === searchParams.status.toLowerCase()
      );
    }

    setFilteredUsers(filtered);
  };

  // Hàm xử lý khi người dùng thay đổi giá trị tìm kiếm
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Tiêu đề */}
      <Typography variant="h4" gutterBottom>
        Quản lý người dùng
      </Typography>
      {/* Form tìm kiếm */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        {/* Input tìm kiếm theo tên */}
        <TextField
          label="Tìm theo tên"
          variant="outlined"
          size="small"
          sx={{ width: 200 }}
          name="name"
          value={searchParams.name}
          onChange={handleSearchChange}
        />
        {/* Input tìm kiếm theo email */}
        <TextField
          label="Tìm theo email"
          variant="outlined"
          size="small"
          sx={{ width: 200 }}
          name="email"
          value={searchParams.email}
          onChange={handleSearchChange}
        />
        {/* Select tìm kiếm theo trạng thái */}
        <FormControl className="status-select" sx={{ width: 200 }} size="small">
          <InputLabel htmlFor="status-select">Trạng thái</InputLabel>
          <Select
            size="small"
            label="Trạng thái"
            name="status"
            value={searchParams.status}
            onChange={handleSearchChange}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="active">Hoạt động</MenuItem>
            <MenuItem value="blocked">Đã khóa</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {/* Bảng hiển thị danh sách users */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên người dùng</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody >
            {filteredUsers.map((user) => (
              <TableRow key={user.userId}>
                <TableCell>{user.userId}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(user)} color="primary" aria-label="edit">
                    <VisibilityIcon sx={{ color: 'blue' }} />
                  </IconButton>
                  <IconButton onClick={() => {
                    if (user.status === 'active') {
                      handleBlock(user.userId);
                    } else {
                      handleUnblock(user.userId);
                    }
                  }} color="error" aria-label="block">
                    {user.status === 'active' ? <BlockIcon /> : <CheckCircleIcon />}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog chỉnh sửa thông tin người dùng */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="username"
            label="Tên người dùng"
            fullWidth
            value={formData.username}
            onChange={handleInputChange}
            disabled={true}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            fullWidth
            value={formData.email}
            onChange={handleInputChange}
            disabled={true}
          />
          <TextField
            margin="dense"
            name="role"
            label="Vai trò"
            fullWidth
            value={formData.role}
            onChange={handleInputChange}
            disabled={true}
          />
          <TextField
            margin="dense"
            name="status"
            label="Trạng thái"
            fullWidth
            value={formData.status}
            onChange={handleInputChange}
            disabled={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
          {/* <Button onClick={handleSubmit} variant="contained" color="primary">
            Lưu
          </Button> */}
        </DialogActions>
      </Dialog>

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

export default UserManagement; 