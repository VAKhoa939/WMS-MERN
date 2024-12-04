const authController = require("../controllers/authController");
const middlewareController = require("../middleware/middleware");

const router = require("express").Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/refresh", authController.requestRefreshToken);
router.delete(
  "/:id",
  middlewareController.verifyTokenAndAdminAuth,
  authController.deleteUsers
);
router.post(
  "/logout",
  middlewareController.verifyToken,
  authController.userLogout
);
router.post(
  "/logout",
  middlewareController.verifyToken,
  authController.resetPassword
);

module.exports = router;
