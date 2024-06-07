import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../config/api";
import { CategoryForm } from "../../components";
import { Modal } from "antd";

const CreateCategory = () => {
  const [categorires, setCategorires] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updateName, setUpdateName] = useState("");
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
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(
        `/api/v1/category/update-category/${selected._id}`,
        {
          name: updateName,
        }
      );
      if (data.success) {
        toast.success(data.messatge);
        setSelected(null);
        setUpdateName("");
        setVisible(false);
        getAllCategories();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while updating category");
    }
  };

  const handleDelete = async (pid) => {
    try {
      const { data } = await api.delete(
        `/api/v1/category/delete-category/${pid}`
      );
      if (data.success) {
        toast.success(data.message);

        getAllCategories();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while deleting category");
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
                    <button
                      className="btn btn-primary ms-2"
                      onClick={() => {
                        setVisible(true);
                        setUpdateName(category.name);
                        setSelected(category);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger ms-2"
                      onClick={() => handleDelete(category._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </>
          </tbody>
        </table>
      </div>
      <Modal onCancel={() => setVisible(false)} open={visible} footer={null}>
        <CategoryForm
          className="p-1"
          value={updateName}
          setValue={setUpdateName}
          handleSubmit={handleUpdate}
        />
      </Modal>
    </div>
  );
};

export default CreateCategory;
