var jwt = require("jsonwebtoken"),
  config = require("../config/auth"),
  user = require("../models/user");

verifyToken = (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers["token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided" });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = async (req, res, next) => {
  await user.findOne({ _id: req.userId, role: 'ADMIN' }).then((userInfo) => {
    if (userInfo != null) {
      next();
    } else {
      return res.status(401).send({ message: "Require 'ADMIN' Role!" });
    }
  }).catch(() => {
    return res.status(401).send({ message: "Require 'ADMIN' Role!" });
  })
};

const authJwt = {
  isAdmin,
  verifyToken,
};

module.exports = authJwt;