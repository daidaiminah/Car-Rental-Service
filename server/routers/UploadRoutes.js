// server/routes/uploadRoutes.js
import express from 'express';
import { cloudinary } from '../middlewares/upload.js';

const router = express.Router();

// Delete an image from Cloudinary
router.delete('/image', async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      return res.status(400).json({ success: false, message: 'Public ID is required' });
    }
    
    const result = await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ success: false, message: 'Error deleting image' });
  }
});

export default router;