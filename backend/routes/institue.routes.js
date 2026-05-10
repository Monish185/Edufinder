const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const {
  createInstitute,
  getInstitutes,
  getInstituteById,
  deleteInstitute,
} = require("../controllers/institute.controller");

router.post(
  "/create",
  authMiddleware,
  upload.single("image"),
  createInstitute
);

router.get("/", getInstitutes);
router.get("/:id", getInstituteById);

// Admin only delete
router.delete("/:id", authMiddleware, deleteInstitute);

module.exports = router;
