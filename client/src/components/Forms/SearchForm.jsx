import React from "react";
import { useSearch } from "../../context/search";
import { api } from "../../config/api";
import { useNavigate } from "react-router-dom";

const SearchForm = () => {
  const [value, setValue] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(
        `/api/v1/product/search/${value.keyword}`
      );

      setValue({ ...value, results: data.products });

      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form className="d-flex" role="search" onSubmit={handleSubmit}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={value.keyword}
          onChange={(e) => setValue({ ...value, keyword: e.target.value })}
        />
        <button className="btn btn-outline-success">Search</button>
      </form>
    </div>
  );
};

export default SearchForm;
