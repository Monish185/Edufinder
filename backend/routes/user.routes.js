const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth.middleware");
const { getFavorites, toggleFavorite, getProfile } = require("../controllers/user.controller");

router.get("/profile", authMiddleware, getProfile);
router.get("/favorites", authMiddleware, getFavorites);
router.post("/favorites", authMiddleware, toggleFavorite);

module.exports = router;
