import { Types } from "mongoose";
import User from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ success: true, message: "", data: users });
  } catch (error) {
    console.error("Error during get all users: ", error.message);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    if (!Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng này" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng này" });
    }
    const { password, ...others } = user._doc;
    return res
      .status(200)
      .json({ success: true, message: "", data: { ...others } });
  } catch (error) {
    console.error("Error during get user by id: ", error.message);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const reqUser = req.body;
  try {
    if (!Types.ObjectId.isValid(id)) {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng này" });
    }

    const user = await User.findById(id);
    if (!user) {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng này" });
    }

    const updatedUser = await user.updateOne({ $set: reqUser });
    return res.status(200).json({
      success: true,
      message: "Cập nhật người dùng thành công",
      data: { ...updatedUser },
    });
  } catch (error) {
    console.error("Error during update user: ", error.message);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    if (!Types.ObjectId.isValid(id)) {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng này" });
    }

    const user = await User.findById(id);
    if (!user) {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng này" });
    }

    await user.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Người dùng này đã được xóa",
    });
  } catch (error) {
    console.error("Error during delete user: ", error.message);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const isActive = async (req, res) => {
  const id = req.params.id;
  try {
    if (!Types.ObjectId.isValid(id)) {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng này" });
    }

    const user = await User.findById(id);
    if (!user) {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng này" });
    }

    const updatedUser = await user.updateOne({ is_active: !user.is_active });
    return res.status(200).json({
      success: true,
      message: "Người dùng này đã được cập nhật",
      data: { ...updatedUser },
    });
  } catch (error) {
    console.error("Error during update user: ", error.message);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};
