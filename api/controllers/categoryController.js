import slugify from "slugify";

import categoryModel from "../models/categoryModel.js";

const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    if (!name) res.status(401).send({ message: "Name is required" });

    const duplicate = await categoryModel.findOne({ name });
    if (duplicate)
      return res
        .status(200)
        .send({ success: true, message: "Category Already exist" });

    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();

    res.status(201).send({
      success: true,
      message: "New category created",
      category,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while creating category",
      err,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category Updated Successfully",
      category,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while update category",
    });
  }
};

export default { createCategory, updateCategory };
