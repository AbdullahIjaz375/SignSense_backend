const bucket = require("../utils/firebaseAdmin");

const inverseMapping = {
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/A.png?alt=media`]:
    "A",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/B.png?alt=media`]:
    "B",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/C.png?alt=media`]:
    "C",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/D.png?alt=media`]:
    "D",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/E.png?alt=media`]:
    "E",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/F.png?alt=media`]:
    "F",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/G.png?alt=media`]:
    "G",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/H.png?alt=media`]:
    "H",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/I.png?alt=media`]:
    "I",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/J.png?alt=media`]:
    "J",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/K.png?alt=media`]:
    "K",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/L.png?alt=media`]:
    "L",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/M.png?alt=media`]:
    "M",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/N.png?alt=media`]:
    "N",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/O.png?alt=media`]:
    "O",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/P.png?alt=media`]:
    "P",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/Q.png?alt=media`]:
    "Q",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/R.png?alt=media`]:
    "R",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/S.png?alt=media`]:
    "S",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/T.png?alt=media`]:
    "T",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/U.png?alt=media`]:
    "U",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/V.png?alt=media`]:
    "V",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/W.png?alt=media`]:
    "W",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/X.png?alt=media`]:
    "X",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/Y.png?alt=media`]:
    "Y",
  [`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/ASL/Z.png?alt=media`]:
    "Z",
};

module.exports = inverseMapping;
