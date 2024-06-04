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

const getCategory = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Category Found",
      category,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while getting a category",
    });
  }
};
const getAllCategory = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All Category",
      category,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while getting a category",
    });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const category = await categoryModel.findByIdAndDelete({
      _id: req.params.id,
    });
    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully!",
      category,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while getting a category",
    });
  }
};

export default {
  createCategory,
  updateCategory,
  getCategory,
  getAllCategory,
  deleteCategory,
};
