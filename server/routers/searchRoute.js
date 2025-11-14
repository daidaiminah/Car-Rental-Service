import express from 'express';
import { searchSite } from '../controllers/searchController.js';

const router = express.Router();

router.get('/', searchSite);

export default router;
