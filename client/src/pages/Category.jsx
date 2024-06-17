import { useCategory } from "./../hooks/useCategory";
import { Link } from "react-router-dom";

const Category = () => {
  const category = useCategory();
  return (
    <div className="d-flex justify-content-around flex-wrap align-items-sm-center m-5">
      {category?.map((item) => (
        <Link to={`/category/${item.slug}`} key={item._id}>
          <button className="btn btn-primary">{item.name}</button>
        </Link>
      ))}
    </div>
  );
};

export default Category;
