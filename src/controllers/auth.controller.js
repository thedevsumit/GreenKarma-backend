const User = require("../models/auth.model");
const bcrpyt = require("bcryptjs");
const generateToken = require("../lib/utils");

const register = async (req, res) => {
  const { email, fullName, password, profilePic, address } = req.body;

  try {
    if (!email || !fullName || !password || !address) {
      return res.status(400).json({
        msg: "Please fill all the fields",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        msg: "Make sure the password is atleast 6 characters long",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        msg: "User already exists with this email",
      });
    }

    const salt = await bcrpyt.genSalt(10);
    const hashPass = await bcrpyt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      profilePic,
      password: hashPass,
      address,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      newUser.save();
      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        address,
      });
    } else {
      return res.status(400).json({
        msg: "Invalid user Data",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        msg: "Fill all the fields first",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "User dont exists with this email",
      });
    }

    const isPassCorrect = await bcrpyt.compare(password, user.password);
    if (!isPassCorrect) {
      return res.status(400).json({
        msg: "Invalid password",
      });
    }
    generateToken(user._id, res);
    res.status(200).json({
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      _id: user._id,
    });
  } catch (error) {
    console.log("Error :", error);
    res.status(500).json({
      msg: "Interal server error",
    });
  }
};

const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    res.status(200).json({
      msg: "Successfully logged out",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const checkAuth = (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      msg: "Interal server error",
    });
  }
};

const profile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userDetails = await User.findById(userId).select("-password");
    if (!userDetails) {
      return res.status(404).json({
        msg: "user not found",
        code: 404,
      });
    }
    return res.status(201).json({ userDetails });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
      code: 500,
    });
  }
};

module.exports = { register, login, logout, checkAuth, profile };
