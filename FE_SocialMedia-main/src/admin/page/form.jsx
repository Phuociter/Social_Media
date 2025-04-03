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

import { Box, Button, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material"; 
import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../component/Header";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
  const Form = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    console.log(values);
  };

  return (
    <Box m="20px">
      <Header title="Post Management" subtitle="Manage your posts" />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow >
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody  >
            <TableRow>
              <TableCell>post1</TableCell>
              <TableCell>post2</TableCell>
              <TableCell>post3</TableCell>
              <TableCell >
                <Button variant="contained" color="blue">Edit</Button>
                <Button variant="contained" color="error">Delete</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Form;
