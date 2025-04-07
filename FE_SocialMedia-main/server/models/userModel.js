import { type } from "@testing-library/user-event/dist/type";
import mongoose, { Schema } from "mongoose";

//schema
const userSchema = new mongoose.Schema(
  {
      /*Tên*/
    /*firstName: {
      type: String,
      required: [true, "First Name is Required!"],
    },*/
      /*Họ*/
    /*lastName: {
      type: String,
      required: [true, "Last Name is Required!"],
    },*/
    screen_name:{
      type: String,
      required: [true, "Screen name is Required!"],
    },
    email: {
      type: String,
      required: [true, " Email is Required!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required!"],
      minlength: [6, "Password length should be greater than 6 character"],
      select: true,
    },
    location: { type: String },
    /*Ảnh đại diện*/
    profileimage: { type: String },
    /*Ảnh bìa*/
    profilecover: { type: String },
    profession: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    views: [{ type: String }],
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);

export default Users;
