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
    "shipping",
  ];
  try {
    const { name, price, description, category, quantity } = req.fields;
    const { photo } = req.files;

    for (const field of requiredField) {
      if (!req.field[field])
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

export default { createProduct };
