const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require('cors');


const app = express();


app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

// File upload setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Route to receive the QR code
app.post("/upload", upload.single("qrCode"), (req, res) => {
  const qrCode = req.file;

  if (qrCode) {
    const filePath = path.join(uploadsDir, "qr-code.png");
    fs.writeFileSync(filePath, qrCode.buffer);
    return res.json({ success: true, message: "QR code saved." });
  }

  return res.status(400).json({ success: false, message: "No file received." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
