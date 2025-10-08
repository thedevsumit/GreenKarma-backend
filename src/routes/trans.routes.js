const express = require("express");
const protectRoute = require("../middlewares/auth.midlleware");
const {
  purchaseItem,
  getMyPurchases,
  getMySales,
} = require("../controllers/purchase.controller");
const { addPoints } = require("../controllers/reward.controller");

const transRoutes = express.Router();

transRoutes.post("/transactions/purchase", protectRoute, purchaseItem);
transRoutes.get("/transactions/my-purchases", protectRoute, getMyPurchases);
transRoutes.get("/transactions/my-sales", protectRoute, getMySales);
transRoutes.put("/transactions/reward",protectRoute,addPoints)

module.exports = { transRoutes };
