import { useEffect, useState } from "react";
import { api } from "../config/api";

export const useCategory = () => {
  const [category, setCategory] = useState([]);

  const getCategory = async () => {
    try {
      const { data } = await api.get("/api/v1/category/get-category");
      if (data.success) setCategory(data.category);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  return category;
};
