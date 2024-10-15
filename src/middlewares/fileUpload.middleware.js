import multer from "multer";

const storageConfig = multer.diskStorage({
  filename: (req, file, cb) => {
    const fileName = file.originalname;
    const newFileName = new Date().toISOString() + fileName;
    cb(null, newFileName);
  },
  destination: (req, file, cb) => cb(null, "./public/images"),
});

export const upload = multer({
  storage: storageConfig,
});
