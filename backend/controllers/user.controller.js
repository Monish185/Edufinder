const User = require("../models/user");

const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "favorites",
        populate: { path: "createdBy", select: "name email" },
      });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ favorites: user.favorites || [] });
  } catch (error) {
    console.error("getFavorites error:", error);
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const { instituteId } = req.body;
    if (!instituteId) {
      return res.status(400).json({ message: "Institute ID is required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const idx = user.favorites.indexOf(instituteId);
    if (idx > -1) {
      user.favorites.splice(idx, 1);
      await user.save();
      return res.status(200).json({ message: "Removed from favorites", saved: false });
    } else {
      user.favorites.push(instituteId);
      await user.save();
      return res.status(200).json({ message: "Saved to favorites!", saved: true });
    }
  } catch (error) {
    console.error("toggleFavorite error:", error);
    res.status(500).json({ message: "Failed to update favorites" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

module.exports = { getFavorites, toggleFavorite, getProfile };
