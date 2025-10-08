const mongoose = require("mongoose");
const Item = require("../models/item.model");

const v2 = require("../lib/cloudinary");
const postItem = async (req, res) => {
  try {
    const { title, description, category, price, image, username, avatar,address } =
      req.body;

    if (!title || !category || !price) {
      return res.status(400).json({
        msg: "Title, category, and price are required",
        code: 400,
      });
    }

    const uploadResponse = await v2.uploader.upload(image);

    const newItem = new Item({
      title,
      description: description || "",
      category,
      price,
      image: uploadResponse.secure_url || "",
      seller: req.user.id,
      username,
      avatar,
      address,
    });
    
    await newItem.save();

    return res.status(201).json({
      msg: "Item posted successfully",
      item: newItem,
      code: 201,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
      code: 500,
    });
  }
};

const getItems = async (req, res) => {
  try {
    const items = await Item.find({ available: true })
      .populate("seller", "fullName email profilePic")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      msg: "Items fetched successfully",
      items,
      code: 200,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
      code: 500,
    });
  }
};

const getUniqItem = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Item.findById(id).populate(
      "seller",
      "fullName email profilePic"
    );

    if (!result) {
      return res.status(404).json({
        msg: "Item not found",
        code: 404,
      });
    }

    return res.status(201).json({
      status: "success",
      result,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
      code: 500,
    });
  }
};

const updateItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const updates = req.body;
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        msg: "Item not found",
        code: 404,
      });
    }

    if (item.seller.toString() !== req.user.id) {
      return res.status(403).json({
        msg: "You are not authorized to update this item",
        code: 403,
      });
    }

    Object.keys(updates).forEach((key) => {
      item[key] = updates[key];
    });

    await item.save();

    return res.status(200).json({
      msg: "Item updated successfully",
      item,
      code: 200,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
      code: 500,
    });
  }
};

const deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    const items = await Item.findById(id);

    if (!items) {
      return res.status(403).json({
        msg: "No items listed with this id",
        code: 403,
      });
    }

    const userID = req.user.id;

    if (items.seller.toString() !== userID) {
      return res.status(404).json({
        msg: "You dont have the perms to delete this item",
        code: 404,
      });
    }

    const result = await Item.deleteOne({ _id: id });
    return res.status(201).json({
      msg: "Success",
      result,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
      code: 500,
    });
  }
};

const getItemListedByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const items = await Item.find({ seller: userId })
      .sort({ createdAt: -1 })
      .lean();

    if (items.length === 0) {
      return res.status(404).json({
        msg: "No items listed by the user",
        code: 404,
      });
    }

    return res.status(200).json({ items });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
      code: 500,
    });
  }
};

module.exports = {
  postItem,
  getItems,
  getUniqItem,
  updateItem,
  deleteItem,
  getItemListedByUser,
};
