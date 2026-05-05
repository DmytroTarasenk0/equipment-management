const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/single", verifyToken, upload.single("file"), (req, res) => {
  res.status(200).json({
    message: "Success",
    file: req.file,
  });
});

// up to 5 files
router.post("/multiple", verifyToken, upload.array("files", 5), (req, res) => {
  res.status(200).json({
    message: "Success",
    files: req.files,
  });
});

module.exports = router;
