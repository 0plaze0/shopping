import slugify from "slugify";
import fs from "fs";
import productModel from "../models/productModel.js";

const createProduct = async (req, res) => {
  const requiredField = [
    "name",
    "price",
    "description",
    "category",
    "quantity",
  ];
  try {
    const { name, price, description, category, quantity } = req.fields;
    const { photo } = req.files;

    for (const field of requiredField) {
      if (!req.fields[field])
        return res.status(400).send({ error: `${field} is required` });
    }

    if (!photo && photo.size < 1000000)
      return res
        .status(400)
        .send({ error: "Photo is requried and should be less then 1mb" });

    const product = new productModel({ ...req.fields, slug: slugify(name) });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();

    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while creating product",
      err,
    });
  }
};

const updateProduct = async (req, res) => {
  const requiredField = [
    "name",
    "price",
    "description",
    "category",
    "quantity",
  ];
  try {
    const { name, price, description, category, quantity } = req.fields;
    const { photo } = req.files;

    for (const field of requiredField) {
      if (!req.fields[field])
        return res.status(400).send({ error: `${field} is required` });
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();

    res.status(201).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while updating product",
      err,
    });
  }
};

//different api for photo for better performance
const getAllProduct = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "All Products",
      products,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while getting product",
      err,
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    return res.status(200).send({
      success: true,
      message: "All Products",
      product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while getting a product",
      err,
    });
  }
};

const productPhoto = async (req, res) => {
  try {
    const productPhoto = await productModel
      .findById(req.params.pid)
      .select("photo");

    if (productPhoto.photo.data) {
      res.set("Content-type", productPhoto.photo.contentType);
    }
    return res.status(200).send(productPhoto.photo.data);
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      err,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid);
    return res.status(200).send({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error while deleting photo",
      err,
    });
  }
};

const filterProduct = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let arg = {};
    if (checked.length > 0) arg.category = checked;
    if (radio.length) arg.price = { $gte: radio[0], $lte: radio[1] };
    const product = await productModel.find(arg);
    res.status(200).send({
      success: true,
      message: "Successfully filtered product",
      product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while filtering",
      err,
    });
  }
};
const productCount = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      message: "Successfully filtered product",
      total,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in product count",
      err,
    });
  }
};
const productList = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const product = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Successfully filtered product",
      product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in product list",
      err,
    });
  }
};

export default {
  createProduct,
  getAllProduct,
  getProduct,
  productPhoto,
  deleteProduct,
  updateProduct,
  filterProduct,
  productList,
  productCount,
};
