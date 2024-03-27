const bucket = require("../utils/firebaseAdmin");

const uploadToFirebase = (req, res, next) => {
  if (!req.file) {
    return next(); // Skip if no file is uploaded
  }

  let folder = "uploads";
  if (req.file.mimetype.startsWith("audio/")) {
    folder = "audios";
  }

  const filePath = `${folder}/${req.file.originalname}`;
  const blob = bucket.file(filePath);

  const blobWriter = blob.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  blobWriter.on("error", (err) => next(err));

  blobWriter.on("finish", () => {
    // Make the file publicly accessible and construct the public URL
    blob
      .makePublic()
      .then(() => {
        req.file.firebaseUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
        next();
      })
      .catch((err) => next(err)); // Handle potential errors in making the file public
  });

  blobWriter.end(req.file.buffer);
};

module.exports = uploadToFirebase;
