const bcrypt = require("bcrypt");
const users = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const signUp = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
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
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await users.findOne({ email: email });
    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        const token = jwt.sign(
          {
            userId: userData._id,
            userEmail: userData.email,
          },
          process.env.JWTPRIVATEKEY,
          { expiresIn: "2hr" }
        );
        console.log("token ", token);
        res.json({
          token,
          user: {
            name: userData.name,
            userEmail: userData.email,
            userPhone: userData.phone,
            userImage:userData.image,
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
const uploadImage = async (req, res) => {
  try {
    const file = req.file.filename;
    const userEmail = req.body.userEmail;
    console.log(file, userEmail);
    const user = await users.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.image = file;

    await user.save();

    console.log("User image updated in MongoDB:", user);

    
    res.json({
      message: "File uploaded successfully",
      user: {
        name: user.name,
        userEmail: user.email,
        userPhone: user.phone,
        userImage: user.image,
      },
    });

    
  } catch (error) {}
};

module.exports = {
  signUp,
  login,
  uploadImage,
};
