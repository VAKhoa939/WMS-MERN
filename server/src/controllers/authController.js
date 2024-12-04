const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let refreshTokens = [];

const authController = {
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      const newUser = await new User({
        name: req.body.name,
        email: req.body.email,
        password: hashed,
      });

      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        admin: user.admin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
  },
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        admin: user.admin,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "365d",
      }
    );
  },
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid password!" });
      }

      const accessToken = authController.generateAccessToken(user);
      const refreshToken = authController.generateRefreshToken(user);

      refreshTokens.push(refreshToken);
      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "strict",
      });

      const { password, ...others } = user._doc;
      res.status(200).json({ ...others, accessToken });
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ message: "Internal server error!" });
    }
  },
  deleteUsers: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("You're not authenticated");
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid");
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(403).json("Invalid or expired refresh token");
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      res.cookies("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({ accessToken: newAccessToken });
    });
  },
  userLogout: async (req, res) => {
    res.clearCookie("refreshtoken");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    res.status(200).json("You logged out successfully");
  },
  resetPassword: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);
      const user = await User.findOneAndUpdate(
        { email: req.body.email },
        { password: hashed },
        { new: true }
      );
      res.status(200).json("Password has been updated");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = authController;
