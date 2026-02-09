const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(
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

    regnum:{
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
    isCsi: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 850,
    },
  },
  { _id: false }
);

const teamLeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    regnum:{
      type: String,
      required: true,
      trim: true,
    },
    gender: {
  type: String,
  enum: ["Male", "Female", ""],
  default: "",
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
    isCsi: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 850,
    },
  },
  { _id: false }
);

const registrationSchema = new mongoose.Schema(
  {
    teamcode:{
      default:null,
      unique:true,
      type:String
    },
    teamName: {
      type: String,
      required: true,
      trim: true,
      // unique: true,
    },

    collegeType: {
      type: String,
      enum: ["srkr", "others"],
      required: true,
    },

    otherCollege: {
      type: String,
      trim: true,
    },

    teamLead: {
      type: teamLeadSchema,
      required: true,
    },

    teamMembers: {
      type: [teamMemberSchema],
      validate: {
        validator: function (arr) {
          return arr.length >= 3 && arr.length <= 6;
        },
        message:
          "Team must have minimum 4 and maximum 6 members including team lead",
      },
    },
    transactionId: {
  type: String,
  default: null,       
  trim: true,
},
paymentStatus: {
  type: String,
  enum: ["PENDING", "DONE", "FAILED","PAID"],
  default: "PENDING",
},
  problemstatment:{
    type:[String],
    default:[]
  },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", registrationSchema);
