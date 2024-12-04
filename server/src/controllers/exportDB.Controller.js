const { parse } = require("json2csv");
const Goods = require("../models/goodsModel");

const exportController = {
  exportDB: async (req, res) => {
    try {
      const goodsList = await Goods.find();

      if (goodsList.length === 0) {
        return res.status(404).json({ message: "No goods found to export" });
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
        console.error("Error parsing to CSV:", error);
        return res
          .status(500)
          .json({ message: "Error generating CSV", error: error.message });
      }

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=assets-export.csv"
      );
      res.header("Content-Type", "text/csv");

      return res.send(csv);
    } catch (error) {
      console.error("Error exporting data:", error);
      res
        .status(500)
        .json({ message: "Failed to export assets", error: error.message });
    }
  },
};

module.exports = exportController;
