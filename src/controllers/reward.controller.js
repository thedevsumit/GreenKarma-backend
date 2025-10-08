const User = require("../models/auth.model");

const addPoints = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
        code: 404,
      });
    }

    let pointsToAdd = 0;
    if (reason === "submission") {
      pointsToAdd = 25;
    } else if (reason === "purchase") {
      pointsToAdd = 50;
    }

    user.points = (user.points || 0) + pointsToAdd;
    await user.save();

    return res.status(200).json({
      msg: `Added ${pointsToAdd} points for ${reason}`,
      points: user.points,
      code: 200,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
      code: 500,
    });
  }
};
module.exports = { addPoints };
