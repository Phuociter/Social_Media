import axios from "axios";

export const searchAll = async (keyword) => {
  const res = await axios.get(`/api/search/SearchFor`, {
    params: { keyword },
  });
  return res.data;
};
