import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../config/api";
import { CategoryForm } from "../../components";

const CreateCategory = () => {
  const [categorires, setCategorires] = useState([]);
  const [name, setName] = useState("");

  const getAllCategories = async () => {
    try {
      const { data } = await api("/api/v1/category/get-category");
      if (data.success) {
        setCategorires(data.category);
      }
    } catch (error) {
      console.log(err);
      toast.error("Something went wrong while getting category");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/v1/category/create-category", {
        name,
      });
      if (data.success) {
        setName("");
        toast.success(`${name} category created`);
        getAllCategories();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while creating category");
    }
  };
  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <div>
      <h1>Manage Category</h1>
      <CategoryForm
        handleSubmit={handleSubmit}
        value={name}
        setValue={setName}
      />
      <div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Name</th>

              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <>
              {categorires.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>
                    <button className="btn btn-primary">Edit</button>
                  </td>
                </tr>
              ))}
            </>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreateCategory;
