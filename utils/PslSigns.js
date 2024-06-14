const bucket = require("../utils/firebaseAdmin");

const pslSigns = {
  ا: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fا.png?alt=media`,
  },
  ب: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fب.png?alt=media`,
  },
  پ: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fپ.png?alt=media`,
  },
  ت: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fت.png?alt=media`,
  },
  ٹ: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fٹ.png?alt=media`,
  },
  ث: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fث.png?alt=media`,
  },
  ج: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fج.png?alt=media`,
  },
  چ: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fچ.png?alt=media`,
  },
  ح: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fح.png?alt=media`,
  },
  خ: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fخ.png?alt=media`,
  },
  د: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fد.png?alt=media`,
  },
  ڈ: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fڈ.png?alt=media`,
  },
  ذ: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fذ.png?alt=media`,
  },
  ر: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fر.png?alt=media`,
  },
  ڑ: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fڑ.png?alt=media`,
  },
  ز: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fز.png?alt=media`,
  },
  ژ: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fژ.png?alt=media`,
  },
  س: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fس.png?alt=media`,
  },
  ش: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fش.png?alt=media`,
  },
  ص: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fص.png?alt=media`,
  },
  ض: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fض.png?alt=media`,
  },
  ط: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fط.png?alt=media`,
  },
  ظ: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fظ.png?alt=media`,
  },
  ع: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fع.png?alt=media`,
  },
  غ: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fغ.png?alt=media`,
  },
  ف: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fف.png?alt=media`,
  },
  ق: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fق.png?alt=media`,
  },
  ک: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fک.png?alt=media`,
  },
  گ: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fگ.png?alt=media`,
  },
  ل: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fل.png?alt=media`,
  },
  م: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fم.png?alt=media`,
  },
  ن: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fن.png?alt=media`,
  },
  و: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fو.png?alt=media`,
  },
  ہ: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fہ.png?alt=media`,
  },
  ھ: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fھ.png?alt=media`,
  },
  ی: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fی.png?alt=media`,
  },
  ے: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fے.png?alt=media`,
  },
  ء: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fء.png?alt=media`,
  },
  ں: {
    image: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/PSL%2Fں.png?alt=media`,
  },
};

module.exports = { pslSigns };
