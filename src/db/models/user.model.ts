import { Document, Schema, Types, model } from "mongoose";

export interface ShippingAddress {
  address: string;
  district: string;
  details: string;
}

export interface OrderHistory {
  orderId: Types.ObjectId;
  amount: number;
  date: Date;
}

export interface CartItem {
  productId: Types.ObjectId;
  quantity: number;
}

export interface Review {
  productId: Types.ObjectId;
  rating: number;
  comment?: string;
  date: Date;
}

export interface IUser extends Document {
  userName: string;
  email: string;
  mobile: string;
  password: string;
  role: "user" | "vendor" | "admin";
  profileImage?: string;
  isVerified: boolean;
  shippingAddress: ShippingAddress[];
  orderHistory: OrderHistory[];
  cart: CartItem[];
  reviews: Review[];
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    userName: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile is required."],
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "vendor", "admin"],
      default: "user",
    },
    profileImage: {
      type: String,
      default: undefined,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    shippingAddress: [
      {
        address: String,
        district: String,
        details: String,
      },
    ],
    orderHistory: [
      {
        orderId: {
          type: Schema.Types.ObjectId,
          ref: "Order",
        },
        amount: Number,
        date: Date,
      },
    ],
    cart: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
    reviews: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: String,
        date: {
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

const User = model<IUser>("User", userSchema);

export default User;
