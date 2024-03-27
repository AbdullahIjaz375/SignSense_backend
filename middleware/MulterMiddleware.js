const multer = require("multer");

const multerMiddleware = multer({
  storage: multer.memoryStorage(),
});

module.exports = multerMiddleware;
