/**
 * Dashboard/index.jsx - Trang tổng quan
 *
 * Chức năng:
 * - Hiển thị các thống kê tổng quan:
 *   + Số lượng người dùng
 *   + Số lượng bài viết
 *   + Số lượng truy cập
 * - Hiển thị biểu đồ thống kê
 */

import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { tokens } from "../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PeopleIcon from "@mui/icons-material/People";
import ArticleIcon from "@mui/icons-material/Article";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Header from "../component/Header";
import useStats from "../hooks/useStats";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import useCharts from "../hooks/useCharts"; // Hook tự tạo từ bước trước
import { useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { stats, loading, error } = useStats();
  const convertToSeriesData = (data) => ({
    xAxis: [
      { scaleType: "point", data: data.map((item) => `Tháng ${item.month}`) },
    ],
    series: [{ data: data.map((item) => item.count) }],
  });
  const { chartData, chartLoading, selectedYear, setSelectedYear } =
    useCharts();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m="20px">
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Thống kê tổng quan" />
      </Box>
      <Box
        gridColumn="span 12"
        gridrow="span 1"
        mr="0px"
        display="flex"
        justifyContent="flex-end"
        sx={{ height: 60 }}
      >
        <FormControl sx={{ width: 200, ml: 2 }} size="small" display="flex-End">
          <InputLabel id="year-select-label">Chọn năm cho biểu dồ</InputLabel>
          <Select
            labelId="year-select-label"
            label="Năm"
            value={selectedYear}
            height="40px"
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {[2022, 2023, 2024, 2025].map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="200px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <PeopleIcon
              sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            />
            <Typography
              variant="h2"
              color={colors.grey[100]}
              fontWeight="bold"
              sx={{ m: "10px 0 0 0" }}
            >
              {stats.totalUsers}
            </Typography>
            <Typography color={colors.greenAccent[500]}>
              Tổng số người dùng
            </Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ArticleIcon
              sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            />
            <Typography
              variant="h2"
              color={colors.grey[100]}
              fontWeight="bold"
              sx={{ m: "10px 0 0 0" }}
            >
              {stats.totalPosts}
            </Typography>
            <Typography color={colors.greenAccent[500]}>
              Tổng số bài viết
            </Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: stats.totalPostsIsTatusApprove, label: "chấp nhận" },
                  { id: 1, value: stats.totalPostsIsTatusReject, label: "từ chối" },
                  { id: 2, value: stats.totalPostsIsTatusPending, label: "chờ xử lý" },
                ],
              },
            ]}
            width={100}
            height={100}
          />
        </Box>
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: stats.totalUserIstatusAvtive, label: "hoạt động" },
                  { id: 1, value: stats.totalUserIstatusBlock, label: "Bị khóa" },
                ],
              },
            ]}
            width={100}
            height={100}
          />
        </Box>

        {/* ROW 2 */}
        {/* Biểu đồ bài viết theo tháng */}
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          height="400px"
          p="20px"
        >
          <Typography variant="h6" color={colors.grey[100]} mb="10px">
            Biểu đồ bài viết theo tháng
          </Typography>
          {chartLoading ? (
            <CircularProgress />
          ) : (
            <LineChart
              height={300}
              {...convertToSeriesData(chartData.posts)}
              series={[
                {
                  data: chartData.posts.map((p) => p.totalPosts),
                  label: "Bài viết",
                  color: colors.greenAccent[500],
                  area: true,
                },
              ]}
            />
          )}
        </Box>

        {/* Biểu đồ người dùng theo tháng */}
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          height={"400px"}
          p="20px"
        >
          <Typography variant="h6" color={colors.grey[100]} mb="10px">
            Biểu đồ người dùng theo tháng
          </Typography>
          {chartLoading ? (
            <CircularProgress />
          ) : (
            <LineChart
              height={300}
              {...convertToSeriesData(chartData.users)}
              series={[
                {
                  data: chartData.users.map((u) => u.totalUsers),
                  label: "Người dùng",
                  color: colors.blueAccent[400],
                  area: true,
                },
              ]}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
