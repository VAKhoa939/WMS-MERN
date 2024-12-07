import pkg from "jsonwebtoken";
import User from "../models/userModel.js";
const { verify } = pkg;

export const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    //bearer 123456
    const accessToken = token.split(" ")[1];
    verify(accessToken, process.env.JWT_SECRET, async (error, data) => {
      if (error) {
        return res
          .status(403)
          .json("Token không hợp lệ hoặc đã hết hạn. Xin hãy đăng nhập lại.");
      }

      const user = await User.findById(data.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Token không hợp lệ hoặc đã hết hạn. Xin hãy đăng nhập lại.",
        });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated");
  }
};

export const verifyTokenAndAdminAuth = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.body.id == req.params.id || req.body.admin) next();
    else res.status(403).json("You are not allowed to do that");
  });
};
