const express = require("express");
const {
  register,
  login,
  logout,
  checkAuth,
  profile,
} = require("../controllers/auth.controller");
const protectRoute = require("../middlewares/auth.midlleware");
const { getItemListedByUser } = require("../controllers/item.controller");

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.get("/check", protectRoute, checkAuth);
authRoutes.get("/profile", protectRoute, profile);

module.exports = { authRoutes };
