import { NextFunction, Request, Response } from "express";
import Product from "../db/models/product.model";
import { IUser } from "../db/models/user.model";
import { Types } from "mongoose";

interface IReq extends Request {
  user: IUser;
}

const addProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price } = req.body;
    const vendor = (req as IReq).user._id;

    const newProduct = await new Product({
      name,
      description,
      price: Number(price),
      vendor,
    }).save();
    if (newProduct) {
      res.status(201).json({
        message: "Product added successfully",
        data: { product: newProduct },
        success: true,
      });
    } else {
      res.status(201).json({
        message: "Failed to add product",
        success: false,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getProductsByVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = (req as IReq).user._id;
    const { page, limit, sort } = req.query;
    const LIMIT = Number(limit) || 10;
    const PAGE = Number(page) || 1;
    const SKIP = (PAGE - 1) * LIMIT;
    const SORT = sort === "asc" ? 1 : sort === "desc" ? -1 : undefined;

    const products = await Product.find({ vendor: id })
      .limit(LIMIT)
      .skip(SKIP)
      .sort(SORT ? { price: SORT } : {});
    const totalProducts = await Product.find({ vendor: id }).countDocuments();
    if (products.length === 0) {
      res
        .status(404)
        .json({ message: "No products found for this vendor", success: false });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Vendor products found",
      data: { products, totalProducts },
    });
  } catch (error) {
    next(error);
  }
};

const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, sort } = req.query;
    const LIMIT = Number(limit) || 10;
    const PAGE = Number(page) || 1;
    const SKIP = (PAGE - 1) * LIMIT;
    const SORT = sort === "asc" ? 1 : sort === "desc" ? -1 : undefined;

    const products = await Product.find()
      .limit(LIMIT)
      .skip(SKIP)
      .sort(SORT ? { price: SORT } : {})
      .populate("vendor")
      .exec();
    const totalProducts = await Product.find().countDocuments();

    if (products) {
      res.status(200).json({
        success: true,
        message: "Products fetched",
        data: { products, totalProducts },
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Products fetched failed",
      });
    }
  } catch (error) {
    next(error);
  }
};

const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Product fetched",
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const updated = { ...req.body, vendor: (req as IReq).user._id };
    const updatedProduct = await Product.findOneAndUpdate(
      { $and: [{ _id: id }, { vendor: (req as IReq).user._id }] },
      updated
    );
    console.log({ updatedProduct });
    if (!updatedProduct) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: { product: updatedProduct },
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const vendor = (req as IReq).user._id;
    const deleted = await Product.findOneAndDelete({ _id: id, vendor });
    if (deleted) {
      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

export {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByVendor,
};
