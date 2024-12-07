import User from "../models/userModel.js";
import { genSalt, hash, compare } from "bcrypt";
import pkg from "jsonwebtoken";
import { getUserById } from "./userController.js";
const { sign, verify } = pkg;

let refreshTokens = [];

const generateAccessToken = (user) => {
  return sign(
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
};

const generateRefreshToken = (user) => {
  return sign(
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
};

export const registerUser = async (req, res) => {
  const register = req.body;

  if (
    !register.name ||
    !register.email ||
    !register.password ||
    !register.confirmPassword
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Xin hãy nhập đủ thông tin bắt buộc" });
  }

  const user = User.findOne({ email: register.email });
  if (user) {
    return res
      .status(400)
      .json({ success: false, message: "Email này đã tồn tại" });
  }

  if (register.password !== register.confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Mật khẩu nhập lại không khớp" });
  }

  try {
    const salt = await genSalt(10);
    const hashed = await hash(register.password, salt);

    const newUser = new User({
      name: register.name,
      email: register.email,
      password: hashed,
    });
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Bạn đã đăng ký thành công, hãy trở về trang đăng nhập",
    });
  } catch (error) {
    console.error("Error during register: ", error.message);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const loginUser = async (req, res) => {
  const login = req.body;

  if (!login.email || !login.password) {
    return res
      .status(400)
      .json({ success: false, message: "Xin hãy nhập đủ thông tin" });
  }

  try {
    const user = await User.findOne({ email: login.email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Email hoặc mật khẩu không đúng" });
    }

    const validPassword = await compare(login.password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Email hoặc mật khẩu không đúng" });
    }

    if (!user.is_active) {
      return res
        .status(403)
        .json({ success: false, message: "Tài khoản này đã dừng hoạt động" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    refreshTokens.push(refreshToken);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "None",
    });

    return res.status(200).json({
      success: true,
      message: "Bạn đã đăng nhập thành công",
      data: accessToken,
    });
  } catch (error) {
    console.error("Error during login: ", error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    res.clearCookie("refreshToken");
    return res.status(200).json({
      success: true,
      message: "Bạn đã đăng xuất thành công",
    });
  } catch (error) {
    console.error("Error during logout: ", error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res
      .status(401)
      .json({ success: false, message: "Bạn chưa được xác thực" });

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({
      success: false,
      message: "Token không hợp lệ hoặc đã hết hạn. Xin hãy đăng nhập lại.",
    });
  }

  verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (error, data) => {
    if (error) {
      console.log("Error during verify token", error);
      return res.status(403).json({
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn. Xin hãy đăng nhập lại.",
      });
    }

    const user = await User.findById(data.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn. Xin hãy đăng nhập lại.",
      });
    }

    const newAccessToken = generateAccessToken(user);
    return res.status(200).json({
      success: true,
      message: "",
      data: newAccessToken,
    });
  });
};

export const resetPassword = async (req, res) => {
  const reset = req.body;

  if (!reset.email || !reset.password || !reset.confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Xin hãy nhập đủ thông tin bắt buộc" });
  }

  try {
    const user = await User.findOne({ email: reset.email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy email này" });
    }

    const salt = await genSalt(10);
    const hashed = await hash(reset.password, salt);

    user.updateOne({ password: hashed });
    return res
      .status(200)
      .json({ success: true, message: "Mật khẩu đã được cập nhật" });
  } catch (error) {
    console.error("Error during reset password: ", error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};
