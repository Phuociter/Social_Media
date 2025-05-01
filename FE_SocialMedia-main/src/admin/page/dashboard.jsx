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

import { Box, Button, IconButton, Typography, useTheme, CircularProgress } from "@mui/material";
import { tokens } from "../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PeopleIcon from "@mui/icons-material/People";
import ArticleIcon from "@mui/icons-material/Article";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Header from "../component/Header";
import useStats from "../hooks/useStats";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { stats, loading, error } = useStats();
  

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
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

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Tải báo cáo
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
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
            <VisibilityIcon
              sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            />
            <Typography
              variant="h2"
              color={colors.grey[100]}
              fontWeight="bold"
              sx={{ m: "10px 0 0 0" }}
            >
              {stats.totalViews}
            </Typography>
            <Typography color={colors.greenAccent[500]}>
              Tổng lượt truy cập
            </Typography>
          </Box>
        </Box>
        
      </Box>
    </Box>
  );
};

export default Dashboard;
