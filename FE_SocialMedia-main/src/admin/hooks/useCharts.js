// hooks/useCharts.js
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/admin/chart";

const useCharts = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState({ posts: [], users: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharts = async () => {
      setLoading(true);
      try {
        const [postsRes, usersRes] = await Promise.all([
          axios.get(`${API_URL}/posts?year=${selectedYear}`),
          axios.get(`${API_URL}/users?year=${selectedYear}`),
        ]);
        setChartData({
          posts: postsRes.data,
          users: usersRes.data,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharts();
  }, [selectedYear]); // ✅ Quan trọng: thêm selectedYear vào dependency array

  return { chartData, loading, error, selectedYear, setSelectedYear };
};

export default useCharts;
