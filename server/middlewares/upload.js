import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
 import fs from 'fs';
 
// Get the current directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(__dirname, '../public/uploads');
   
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'car-' + uniqueSuffix + path.extname(file.originalname));
  }
});
 
// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /^image\/(jpe?g|png|webp)$/;
  
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed!'), false);
  }
};

// Configure multer with the storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  // Add debug logging
  onFileUploadStart: function(file) {
    console.log('File upload starting...');
    console.log('File fieldname:', file.fieldname);
    console.log('File originalname:', file.originalname);
    console.log('File mimetype:', file.mimetype);
  },
  onFileUploadComplete: function(file) {
    console.log('File upload complete:', file);
  },
  onError: function(err, next) {
    console.error('Multer error:', err);
    next(err);
  }
});

// Middleware to handle single file upload
const uploadSingleImage = upload.single('image');

// Middleware to handle errors from multer
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        message: 'File too large. Maximum size is 5MB.' 
      });
    }
    return res.status(400).json({ 
      success: false, 
      message: err.message || 'Error uploading file' 
    });
  } else if (err) {
    // An unknown error occurred
    return res.status(500).json({ 
      success: false, 
      message: err.message || 'Server error during file upload' 
    });
  }
  // No errors, proceed to next middleware
  next();
};

export { uploadSingleImage, handleUploadErrors };
