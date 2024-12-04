const goodsController = require("../controllers/goodsController");
const middlewareController = require("../middleware/middleware");

const router = require("express").Router();

router.get("/", middlewareController.verifyToken, goodsController.getAllGoods);
router.get(
  "/:id",
  middlewareController.verifyToken,
  goodsController.getGoodsById
);
router.post("/", middlewareController.verifyToken, goodsController.createGoods);
router.put(
  "/:id",
  middlewareController.verifyToken,
  goodsController.updateGoods
);
router.delete(
  "/:id",
  middlewareController.verifyToken,
  goodsController.deleteGoods
);
router.get(
  "/user/:id",
  middlewareController.verifyToken,
  goodsController.getAllGoodsByUser
);
router.get(
  "/address/:id",
  middlewareController.verifyToken,
  goodsController.getAllGoodsByAddress
);
router.post(
  "/:id/history",
  middlewareController.verifyToken,
  goodsController.createHistory
);

module.exports = router;
