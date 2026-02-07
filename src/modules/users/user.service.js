import { User } from "../../models/users.model.js";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { email, password, phone } = req.body;
// check if user is exist
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        message: "email already exist"
      });
    }

    // hash password
    req.body.password = bcrypt.hashSync(password, 10);

    // encrypt phone
    req.body.phone = CryptoJS.AES.encrypt(phone,"Eng.Mai").toString();

    const user = new User(req.body);
    await user.save();

    res.status(201).json({message: "user added successfully",user});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "user does not exist" });
    }

    // compare password
    if (!bcrypt.compareSync(password, userExist.password)) {
      return res.status(400).json({ message: "invalid email or password" });
    }

    // create JWT
    const token = jwt.sign({ userId: userExist._id },"Eng.Mai",{ expiresIn: "1h" });

    res.status(200).json({message: "login successfully",token});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.userId;
    const { email, password } = req.body;

    // password case
    if (password) {
      return res.status(400).json({ message: "password cannot be updated" });
    }

    // email check
    if (email) {
      const emailExist = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExist) {
        return res.status(400).json({ message: "email already exists" });
      }
    }
  // encrypt phone if exist 
  if (req.body.phone) {
      req.body.phone = CryptoJS.AES.encrypt(req.body.phone, "Eng.Mai").toString();
    }

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });

    res.status(200).json({ message: "user updated successfully", user: updatedUser });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
   const userId = req.userId;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json({message: "user deleted successfully"});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json({ user });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};