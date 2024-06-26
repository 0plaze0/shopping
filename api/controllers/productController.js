import slugify from "slugify";
import fs from "fs";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

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

const searchProduct = async (req, res) => {
  try {
    const { keyword } = req.params;

    const products = await productModel
      .find({
        $or: [
          { name: new RegExp(keyword, "i") },
          { description: new RegExp(keyword, "i") },
        ],
      })
      .select("-photo");

    res.status(200).send({
      success: true,
      message: "Successfully searched product",
      products,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in searching product",
      err,
    });
  }
};

const relatedProduct = async (req, res) => {
  const { pid, category } = req.params;
  console.log(pid, category);
  try {
    const product = await productModel
      .find({
        category,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");

    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in searching product",
      err,
    });
  }
};
const productCategory = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const product = await productModel
      .find({ category })
      .select("-photo")
      .populate("category");

    res.status(200).send({
      success: true,
      message: "Successfully fetched product",
      category,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting product from catgory",
      error,
    });
  }
};

//payment
const brainTreeToken = async (req, res) => {
  try {
    gateway.clientToken.generate({}, (error, response) => {
      if (error) {
        res.status(500).send(error);
      } else res.send(response);
    });
  } catch (error) {
    console.log(error);
  }
};
const brainTreePayment = async (req, res) => {
  try {
    const { cart, nonce } = req.body;

    let total = 0;
    cart.forEach((product) => (total += product.price));

    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      (error, result) => {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else res.status(500).json({ error });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export default {
  productCategory,
  createProduct,
  getAllProduct,
  getProduct,
  productPhoto,
  deleteProduct,
  updateProduct,
  filterProduct,
  productList,
  productCount,
  searchProduct,
  relatedProduct,
  brainTreePayment,
  brainTreeToken,
};
