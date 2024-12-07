import { Types } from "mongoose";
import Address from "../models/addressModel.js";
import Goods from "../models/goodsModel.js";

export const getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({});
    return res
      .status(200)
      .json({ success: true, message: "", data: addresses });
  } catch (error) {
    console.error("Error during get all addresses: ", error.message);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const getAddressById = async (req, res) => {
  const id = req.params.id;
  try {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy địa chỉ nhà kho này",
      });
    }

    const address = await Address.findById(id);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy địa chỉ nhà kho này",
      });
    }

    return res.status(200).json({ success: true, message: "", data: address });
  } catch (error) {
    console.error("Error during get address by id: ", error.message);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const createAddress = async (req, res) => {
  const address = req.body;

  if (!address.building_name) {
    res
      .status(400)
      .json({ success: false, message: "Xin hãy nhập đủ thông tin" });
  }

  try {
    const newAddress = new Address(address);
    await newAddress.save();
    return res.status(201).json({
      success: true,
      message: "Địa chỉ nhà kho mới đã được tạo",
      data: newAddress,
    });
  } catch (error) {
    console.error("Error during create address: ", error.message);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const updateAddress = async (req, res) => {
  const id = req.params.id;
  const reqAddress = req.body;

  try {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy địa chỉ nhà kho này",
      });
    }

    const address = await Address.findById(id);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy địa chỉ nhà kho này",
      });
    }

    const updatedAddress = await address.updateOne({ $set: reqAddress });

    return res.status(200).json({
      success: true,
      message: "Địa chỉ nhà kho này đã được cập nhật",
      data: updatedAddress,
    });
  } catch (error) {
    console.error("Error during update address: ", error.message);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const deleteAddress = async (req, res) => {
  const id = req.params.id;
  try {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy địa chỉ nhà kho này",
      });
    }

    const address = await Address.findById(id);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy địa chỉ nhà kho này",
      });
    }

    await address.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Địa chỉ nhà kho này đã được xóa" });
  } catch (error) {
    console.error("Error during delete address: ", error.message);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};
