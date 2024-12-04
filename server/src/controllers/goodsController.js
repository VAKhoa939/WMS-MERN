const Goods = require("../models/goodsModel");

const goodsController = {
  getAllGoods: async (req, res) => {
    try {
      const goodsList = await Goods.find();
      res.status(200).json(goodsList);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getGoodsById: async (req, res) => {
    try {
      const goods = await Goods.findById(req.params.id);
      if (!goods) {
        return res.status(404).json({ error: "Goods not found" });
      }
      res.status(200).json(goods);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  createGoods: async (req, res) => {
    try {
      const goods = await Goods.create({
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
      });
      res.status(200).json(goods);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateGoods: async (req, res) => {
    try {
      const goods = await Goods.findById(req.params.id);
      if (!goods) {
        return res.status(404).json({ error: "Goods not found" });
      }
      if (goods.goods_id === req.body.goods_id) {
        await goods.updateOne({ $set: req.body });
        res.status(200).json("Goods has been updated");
      } else {
        res.status(403).json("You can update only your goods");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteGoods: async (req, res) => {
    try {
      const goods = await Goods.findById(req.params.id);
      if (!goods) {
        return res.status(404).json({ error: "Goods not found" });
      }
      if (asset.goods_id === req.body.goods_id) {
        await goods.deleteOne();
        res.status(200).json("Goods has been deleted");
      } else {
        res.status(403).json("You can delete only your goods");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getAllGoodsByAddress: async (req, res) => {
    try {
      const goodsList = await Goods.find({
        location: req.params.id,
      });
      res.status(200).json(goodsList);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getAllGoodsByUser: async (req, res) => {
    try {
      const goodsList = await Goods.find({
        responsible_user: req.params.id,
      });
      res.status(200).json(goodsList);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  createHistory: async (req, res) => {
    try {
      const goods = await Goods.findById(req.params.id);
      if (!goods) {
        return res.status(404).json({ error: "Goods not found" });
      }
      goods.history.addToSet(
        await new HistoryItemSchema({
          date: new Date().toUTCString(),
          real_count: req.body.real_count,
          Difference: req.body.Difference,
        })
      );
      res.status(200).json("History has been updated");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = goodsController;
