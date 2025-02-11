import multer from "multer";
import path from "path";
import fs from "fs";
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {      
        const uploadDir = 'public/uploads';  
        try {
            await fs.promises.access(uploadDir, fs.constants.F_OK); 
            cb(null, uploadDir);  
        } catch (err) {
            fs.mkdir(uploadDir, { recursive: true }, (err) => {
                if (err) {
                    return cb(err, uploadDir);  
                }
                cb(null, uploadDir);  
            });
        }
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

const multerUpload = multer({ storage: storage });
export default multerUpload;