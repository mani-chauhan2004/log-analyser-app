const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // multer path setup
        const uploadPath = path.join(__dirname, '../uploads');

        require('fs').mkdirSync(uploadPath, { recursive: true }); //directory check

        cb(null, uploadPath); //passing the dynamic path to callback
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); //unique filename generated
    },
});

const upload = multer({ storage });
module.exports = upload;
