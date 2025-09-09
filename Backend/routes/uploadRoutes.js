const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

router.post("/file", upload.single("file"), (req, res) => {
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ fileUrl });
});

module.exports = router;