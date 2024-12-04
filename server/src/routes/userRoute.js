const userController = require("../controllers/userController");
const middlewareController = require("../middleware/middleware");

const router = require("express").Router();

router.get("/", middlewareController.verifyToken, userController.getAllUsers);
router.get(
  "/:id",
  middlewareController.verifyToken,
  userController.getUserById
);
router.put(
  "/active/:id",
  middlewareController.verifyTokenAndAdminAuth,
  userController.isActive
);
router.put("/:id", middlewareController.verifyToken, userController.updateUser);
router.delete(
  "/:id",
  middlewareController.verifyTokenAndAdminAuth,
  userController.deleteUser
);

module.exports = router;
