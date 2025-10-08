const User = require("../models/auth.model");
const Item = require("../models/item.model");
const Transaction = require("../models/trans.model");

const purchaseItem = async (req, res) => {
  try {
    const {
      itemId,
      paymentMethod,
      title,
      description,
      category,
      price,
      image,
      username,
      avatar,
      address,
    } = req.body;
    const buyerId = req.user.id;

    const item = await Item.findById(itemId);
    if (!item || !item.available) {
      return res.status(400).json({
        msg: "Item not available for purchase",
        code: 400,
      });
    }

    if (item.seller.toString() === buyerId) {
      return res.status(403).json({
        msg: "You cannot buy your own product",
        code: 403,
      });
    }

    const buyer = await User.findById(buyerId);
    const seller = await User.findById(item.seller);

    if (!buyer || !seller) {
      return res.status(404).json({
        msg: "User not found",
        code: 404,
      });
    }

    if (paymentMethod === "Wallet") {
      if (buyer.wallet < item.price) {
        return res.status(400).json({
          msg: "Insufficient wallet balance",
          code: 400,
        });
      }
      buyer.wallet -= item.price;
      seller.wallet += item.price;
      await buyer.save();
      await seller.save();
    }

    const transaction = new Transaction({
      buyer: buyerId,
      seller: item.seller,
      item: item._id,
      amount: item.price,
      paymentMethod,
      status: "Completed",
      title,
      description,
      category,
      price,
      image,
      username,
      avatar,
      address,
    });
    await transaction.save();

    item.available = false;
    await item.save();

    return res.status(200).json({
      msg: "Purchase successful",
      transaction,
      code: 200,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
      code: 500,
    });
  }
};

const getMyPurchases = async (req, res) => {
  try {
    const userId = req.user.id;

    const purchases = await Transaction.find({ buyer: userId })
      .populate("item")
      .populate("seller", "username email");

    return res.status(200).json({ purchases });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
};

const getMySales = async (req, res) => {
  try {
    const userId = req.user.id;

    const sales = await Transaction.find({ seller: userId })
      .populate("item")
      .populate("buyer", "username email");

    return res.status(200).json({ sales });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sales" });
  }
};

module.exports = { purchaseItem, getMyPurchases, getMySales };
