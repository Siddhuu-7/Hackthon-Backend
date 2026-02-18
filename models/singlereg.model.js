const mongoose = require("mongoose");

const Singelreg = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", ""],
      default: "",
    },
    regnum: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      trim: true,
    },
    tshirtSize: {
      type: String,
      required: true,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    collegeType: {
      type: String,
    },
    otherCollege: {
      type: String,
    },
    price: {
      type: String,
      default: "800",
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    paymentStatus: {
  type: String,
  enum: ["PENDING", "DONE", "FAILED","PAID"],
  default: "PENDING",
}
  },
  { timestamps: true }
);

module.exports = mongoose.model("SingelReg", Singelreg);
