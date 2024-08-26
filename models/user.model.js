import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      min: 3,
    },
    email: {
      type: String,
      required: true,
      min: 4,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      min: 4,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
