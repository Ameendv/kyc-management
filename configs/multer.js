const multer = require('multer');


const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });
console.log(upload)

module.exports = upload;
