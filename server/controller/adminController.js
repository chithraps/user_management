const Admin = require("../models/adminModel");
const users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const adminSignUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Admin({
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({
      message: "SignUp successfully completed",
    });
  } catch (error) {
    console.log(error);
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const adminData = await Admin.findOne({ email: email });
    console.log(adminData);
    if (adminData) {
      const passwordMatch = await bcrypt.compare(password, adminData.password);
      console.log(passwordMatch);
      if (passwordMatch) {
        const token = jwt.sign(
          {
            adminId: adminData._id,
            adminEmail: adminData.email,
          },
          process.env.JWTPRIVATEKEY,
          { expiresIn: "2hr" }
        );
        console.log("token ", token);
        res.json({
          token,
          admin: {
            adminEmail: adminData.email,
          },
        });
      }
    } else {
      res.status(400).json({ error: "Email or password is incorrect !!" });
    }
  } catch (error) {
    console.log(error);
  }
};
const fetchUsers = async (req, res) => {
  try {
    const usersData = await users.find().select("-password");
    res.json({ usersData });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const fetchUser = async (req, res) => {
  try {
    const userId = req.query.userId;
    console.log(userId);
    const userData = await users.findById({ _id: userId }).select("-password");

    if (userData) {
      res.json({ userData });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editUser = async (req, res) => {
  try {
    console.log("in edit user");
    const userId = req.query.userId;
    console.log(userId);
    const editUser = req.body;
    console.log(editUser);
    const updatedFields = {};
    for (const key in editUser) {
      updatedFields[key] = editUser[key];
    }
    const updatedUser = await users.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true }
    );
    if (updatedUser) {
      console.log(updatedUser);
      res.json({ updatedUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {}
};
const deleteUser = async (req, res) => {
  try {
    console.log(" in delete user");
    const userId = req.query.userId;
    console.log(userId);
    const result = await users.deleteOne({ _id: userId });
    console.log(result)
    if (result.deletedCount === 1) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const addUser = async(req,res)=>{
  try {
    const newUserData = req.body;
    const name = newUserData.name;
    console.log("in add user ",name)
    const email = newUserData.email;
    const phone = newUserData.phone;
    const password = newUserData.password;
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new users({
      name,
      email,
      password: hashedPassword,
      phone,
    });
    await newUser.save();
    res.status(201).json({
      message: "SignUp successfully completed",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  adminSignUp,
  adminLogin,
  fetchUsers,
  fetchUser,
  editUser,
  deleteUser,
  addUser,
};
