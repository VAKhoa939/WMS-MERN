import { Types } from "mongoose";
import Goods from "../models/goodsModel.js";
import Address from "../models/addressModel.js";

export const getAllGoods = async (req, res) => {
  try {
    const goodsList = await Goods.find();
    return res
      .status(200)
      .json({ success: true, message: "", data: goodsList });
  } catch (error) {
    console.error("Error during get all goods: ", error.message);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const getGoodsById = async (req, res) => {
  const id = req.params.id;
  try {
    if (!Types.ObjectId.isValid(id)) {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy hàng hóa này" });
    }

    const goods = await Goods.findById(id);
    if (!goods) {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy hàng hóa này" });
    }
    return res.status(200).json({ success: true, message: "", data: goods });
  } catch (error) {
    console.error("Error during get goods by id: ", error.message);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const createGoods = async (req, res) => {
  const goods = req.body;
  if (
    !goods.goods_name ||
    !goods.goods_code ||
    !goods.year_of_use ||
    !goods.quantity ||
    !goods.unit_price ||
    !goods.location
  ) {
    res
      .status(400)
      .json({ success: false, message: "Xin hãy nhập đủ thông tin bắt buộc" });
  }
  try {
    // find address's building name
    const address = await Address.findById(goods.location);
    if (!address) {
      console.log("Error during create goods: ", error.message);
      return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }

    // create goods_id
    const year = this.year_of_use || new Date().getFullYear();
    const randomDigits = Math.floor(100 + Math.random() * 900);
    const goods_id = `${year}-${address.building_name}-${randomDigits}`;

    // create goods
    const newGoods = await Goods.create({
      goods_id: goods_id,
      goods_code: goods.goods_code,
      goods_name: goods.goods_name,
      specifications: goods.specifications,
      year_of_use: goods.year_of_use,
      quantity: goods.quantity,
      unit_price: goods.unit_price,
      origin_price: goods.origin_price || goods.unit_price * goods.quantity,
      real_count: goods.real_count,
      depreciation_rate: goods.depreciation_rate,
      remaining_value: goods.remaining_value,
      location: goods.location,
      responsible_user: goods.responsible_user,
      suggested_disposal: goods.suggested_disposal,
      note: goods.note,
    });

    return res.status(201).json({
      success: true,
      message: "Hàng hóa mới đã được tạo",
      data: newGoods,
    });
  } catch (error) {
    console.log("Error during create goods: ", error.message);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const updateGoods = async (req, res) => {
  const id = req.params.id;
  const reqGoods = req.body;
  try {
    // find goods
    if (!Types.ObjectId.isValid(id)) {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy hàng hóa này" });
    }
    const goods = await Goods.findById(req.params.id);
    if (!goods) {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy hàng hóa này" });
    }

    // find address
    const address = await Address.findById(reqGoods.location);
    if (!address) {
      console.log("Error during update goods: ", error.message);
      return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }

    // get current quantity in address
    const goodsListInAddress = Goods.find({ location: address._id });
    const currentQuantity = goodsListInAddress.reduce(
      (sum, goods) => sum + goods.real_count,
      0
    );

    if (currentQuantity + reqGoods.real_count > address.maximum_capacity) {
      res.status(400).json({
        success: false,
        message:
          "Số lượng thực tế mới không phù hợp. Xin hãy nhập lại số lượng thực tế",
      });
    }

    const updatedGoods = await goods.updateOne({ $set: reqGoods });
    return res.status(200).json({
      success: true,
      message: "Hàng hóa này đã được cập nhật",
      data: updatedGoods,
    });
  } catch (error) {
    console.log("Error during update goods: ", error.message);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const deleteGoods = async (req, res) => {
  const id = req.params.id;
  try {
    if (!Types.ObjectId.isValid(id)) {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy hàng hóa này" });
    }

    const goods = await Goods.findById(req.params.id);
    if (!goods) {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy hàng hóa này" });
    }

    await goods.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Hàng hóa này đã được xóa" });
  } catch (error) {
    console.log("Error during delete goods: ", error.message);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const getAllGoodsByAddress = async (req, res) => {
  const location = req.params.id;
  try {
    if (!Types.ObjectId.isValid(location)) {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy địa chỉ này" });
    }

    const goodsList = await Goods.find({
      location: location,
    });
    return res
      .status(200)
      .json({ success: true, message: "", data: goodsList });
  } catch (error) {
    console.log("Error during get all goods by address: ", error.message);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const getAllGoodsByUser = async (req, res) => {
  try {
    const goodsList = await Goods.find({
      responsible_user: req.params.id,
    });
    return res
      .status(200)
      .json({ success: true, message: "", data: goodsList });
  } catch (error) {
    console.log("Error during get all goods by user: ", error.message);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

// export const createHistory = async (req, res) => {
//   try {
//     const goods = await Goods.findById(req.params.id);
//     if (!goods) {
//       return res.status(404).json({ error: "Goods not found" });
//     }
//     goods.history.addToSet(
//       await new HistoryItemSchema({
//         date: new Date().toUTCString(),
//         real_count: req.body.real_count,
//         Difference: req.body.Difference,
//       })
//     );
//     return res.status(200).json("History has been updated");
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// };
