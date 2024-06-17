import { useCategory } from "./../hooks/useCategory";

const Category = () => {
  const category = useCategory();
  return <div>Category</div>;
};

export default Category;
