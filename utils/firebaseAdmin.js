// utils/firebaseAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("../signsense-backend-firebase-adminsdk-nky01-fbce72773a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

module.exports = bucket;
