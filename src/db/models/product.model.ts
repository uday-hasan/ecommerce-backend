import { Document, model, Schema, Types } from "mongoose";

interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  images: string[];
  brand: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  vendor: Types.ObjectId;
  reviews: {
    user: Types.ObjectId;
    rating: { type: Number; min: 1; max: 5 };
    comment: String;
    createdAt: Date;
  }[];
}

const productSchema: Schema<IProduct> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
      trim: true,
      maxLength: [120, "Product name cannot exceed 120 characters"],
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a product description"],
      maxLength: [500, "Product description cannot exceed 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a product price"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Please provide a product category"],
      enum: [
        "electronics",
        "clothing",
        "home",
        "books",
        "beauty",
        "sports",
        "others",
      ],
      default: "others",
    },
    stockQuantity: {
      type: Number,
      required: [true, "Please provide stock quantity"],
      min: [0, "Stock quantity cannot be negative"],
      default: 0,
    },
    images: {
      type: [String],
      required: [true, "Please provide product images"],
      default: [],
    },
    brand: {
      type: String,
      required: [true, "Please provide a product brand"],
      default: "Unknown",
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be below 0"],
      max: [5, "Rating cannot be above 5"],
    },
    reviews: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = model<IProduct>("Product", productSchema);

export default Product;
