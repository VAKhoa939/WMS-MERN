const jwt = require("jsonwebtoken");

const middlewareController = {
  //verify token
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      //bearer 123456
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          res.status(403).json("Token is not valid");
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json("You are not authenticated");
    }
  },

  verifyTokenAndAdminAuth: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.body.id == req.params.id || req.body.admin) next();
      else res.status(403).json("You are not allowed to do that");
    });
  },
};

module.exports = middlewareController;
