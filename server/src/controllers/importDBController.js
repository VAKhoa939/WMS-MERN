import Goods from "../models/goodsModel.js";
import csvParser from "csv-parser";
import { createReadStream } from "fs";

export const importCSV = async (req, res) => {
  try {
    const filePath = req.file.path;
    const goodsList = [];

    createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        const goodsData = {
          goods_code: row.goods_code,
          goods_name: row.goods_name,
          specifications: row.specifications,
          year_of_use: row.year_of_use,
          quantity: row.quantity,
          unit_price: row.unit_price,
          origin_price: row.origin_price,
          real_count: row.real_count,
          depreciation_rate: row.depreciation_rate,
          remaining_value: row.remaining_value,
          location: row.location,
          responsible_user: row.responsible_user,
          suggested_disposal: row.suggested_disposal,
          note: row.note,
        };
        goodsList.push(goodsData);
      })
      .on("end", async () => {
        if (goodsList.length > 0) {
          await Goods.insertMany(goodsList);
          unlinkSync(filePath);
          res
            .status(200)
            .json({ success: true, message: "Nhập file CSV thành công" });
        } else {
          res
            .status(400)
            .json({ message: "Không có hàng hóa hoặc không đúng định dạng" });
        }
      });
  } catch (error) {
    console.log("Error during import CSV: ", error.message);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};
