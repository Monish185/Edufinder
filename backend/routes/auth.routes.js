const express = require("express");
const router = express.Router();
const { userRegister, userLogin, userLogout, googleLogin } = require("../controllers/auth.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/logout", authMiddleware, userLogout);
router.post("/google", googleLogin);

module.exports = router;
