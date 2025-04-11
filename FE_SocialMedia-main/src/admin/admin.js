/**
 * Admin.js - Component chính của trang Admin
 * 
 * Chứa cấu trúc routing và layout chính của trang Admin:
 * - Sidebar: Menu điều hướng bên trái
 * - Topbar: Thanh điều hướng phía trên
 * - Content: Phần nội dung chính
 * 
 * Sử dụng React Router để quản lý routing giữa các trang
 */

// React core imports
import React from 'react';
import { useState } from "react";
import PropTypes from 'prop-types';

// React Router imports
import { Outlet, Routes, Route, Navigate } from "react-router-dom";

// Material-UI imports
import { CssBaseline, ThemeProvider, Box } from "@mui/material";

// Local imports
import { ColorModeContext, useMode } from "./theme";
import Topbar from "./component/Topbar";
import Sidebar from "./component/Sidebar";  


/**
 * Admin Component
 * @returns {JSX.Element} Admin component
 */
const Admin = () => {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const SIDEBAR_WIDTH = 240;

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          {/* Sidebar - Menu điều hướng bên trái */}
          <Box
            component="nav"
            sx={{
              width: isSidebar ? SIDEBAR_WIDTH : 0,
              flexShrink: 0,
              transition: 'width 0.3s ease-in-out',
              height: '100vh',
              position: 'fixed',
              left: 0,
              top: 0,
              zIndex: 1000,
              overflow: 'hidden'
            }}
          >
            <Sidebar isSidebar={isSidebar} />
          </Box>

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: `calc(100% - ${isSidebar ? SIDEBAR_WIDTH : 0}px)`,
              marginLeft: `${isSidebar ? SIDEBAR_WIDTH : 0}px`,
              minHeight: '100vh',
              transition: 'margin-left 0.3s ease-in-out, width 0.3s ease-in-out',
              backgroundColor: theme.palette.background.default
            }}
          >
            {/* Topbar - Thanh điều hướng phía trên */}
            <Box sx={{ 
              position: 'sticky',
              top: 0,
              zIndex: 900,
              backgroundColor: theme.palette.background.default,
              borderBottom: `1px solid ${theme.palette.divider}`
            }}>
              <Topbar setIsSidebar={setIsSidebar} />
            </Box>

            {/* Content Area */}
            <Box sx={{ p: 3 }}>
              <Outlet />
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

Admin.propTypes = {
  // Add prop types if needed
};

export default Admin;
