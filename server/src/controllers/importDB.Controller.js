const Goods = require("../models/goodsModel");
const csvParser = require("csv-parser");
const fs = require("fs");

const importController = {
  importCSV: async (req, res) => {
    try {
      const filePath = req.file.path;
      const goods = [];

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (row) => {
          const goodsData = {
            goods_code: req.body.goods_code,
            goods_name: req.body.goods_name,
            specifications: req.body.specifications,
            year_of_use: req.body.year_of_use,
            quantity: req.body.quantity,
            unit_price: req.body.unit_price,
            origin_price: req.body.origin_price,
            real_count: req.body.real_count,
            depreciation_rate: req.body.depreciation_rate,
            remaining_value: req.body.remaining_value,
            location: req.body.location,
            responsible_user: req.body.responsible_user,
            suggested_disposal: req.body.suggested_disposal,
            note: req.body.note,
          };
          if (goodsData.goods_id && goodsData.goods_code) {
            goods.push(goodsData);
          }
        })
        .on("end", async () => {
          if (goods.length > 0) {
            await Goods.insertMany(goods);
            unlinkSync(filePath);
            res.status(200).json({ message: "CSV file imported successfully" });
          } else {
            res.status(400).json({ message: "No valid goods to import" });
          }
        });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = importController;
