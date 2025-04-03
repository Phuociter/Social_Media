/**
 * Hook lấy thống kê từ API
 * 
 * Chức năng:
 * - Lấy số lượng người dùng
 * - Lấy số lượng bài viết
 * - Lấy số lượng truy cập
 */

import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/adminService';

 const useStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchStats = async () => {
    try {
      setLoading(true); 
      const data = await getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setStats({
        totalUsers: 0,
        totalPosts: 0,
        totalComments: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats
  };
}; 
export default useStats;
