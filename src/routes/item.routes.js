const express = require("express");
const {
  postItem,
  getItems,
  getUniqItem,
  updateItem,
  deleteItem,
  getItemListedByUser,
} = require("../controllers/item.controller");
const protectRoute = require("../middlewares/auth.midlleware");

const itemRoutes = express.Router();

itemRoutes.post("/item-post", protectRoute, postItem);
itemRoutes.get("/item-get", getItems);
itemRoutes.get("/item-getuniq/:id", getUniqItem);
itemRoutes.put("/item-update/:id", protectRoute, updateItem);
itemRoutes.put("/item-delete/:id", protectRoute, deleteItem);
itemRoutes.get("/item-listed", protectRoute, getItemListedByUser);

module.exports = { itemRoutes };
