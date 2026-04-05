import multer from "multer";
import path from "path";
import crypto from "crypto";

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, "../../public/uploads"),
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, crypto.randomUUID() + ext);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter(_req, file, cb) {
    if (ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpeg, png, gif, webp) are allowed"));
    }
  },
});
