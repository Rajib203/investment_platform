import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

/**
 * Upload Single File
 */
router.post(
  "/single",
  authMiddleware,
  upload.single("file"),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      file: req.file,
      url: req.file.path,
    });
  }
);

/**
 * Upload Multiple Files
 */
router.post(
  "/multiple",
  authMiddleware,
  upload.array("files", 5),
  (req, res) => {
    return res.status(200).json({
      success: true,
      files: req.files,
    });
  }
);

export default router;