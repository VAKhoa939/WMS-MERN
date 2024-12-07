import { parse } from "json2csv";
import Goods from "../models/goodsModel.js";

export const exportDB = async (req, res) => {
  try {
    const goodsList = await Goods.find();

    if (goodsList.length === 0) {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy hàng hóa" });
    }

    const fields = [
      "goods",
      "goods_name",
      "goods_code",
      "specifications",
      "year_of_use",
      "quantity",
      "unit_price",
      "origin_price",
      "real_count",
      "depreciation_rate",
      "remaining_value",
      "location",
      "responsible_user",
      "suggested_disposal",
      "note",
      "history",
    ];

    let csv;
    try {
      csv = parse(goodsList, { fields });
    } catch (error) {
      console.error("Error during generate CSV: ", error);
      return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }

    res.setHeader("Content-Disposition", "attachment; filename=wms-export.csv");
    res.header("Content-Type", "text/csv");
    return res.status(200).send(csv);
  } catch (error) {
    console.error("Error during export data: ", error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export default exportDB;
