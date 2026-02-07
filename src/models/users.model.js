import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    min: [18, "age must be not less than 18"],
    max: [60, "age must be not greater than 60"]
  }
});
// create model
export const User = mongoose.model("User", userSchema);
