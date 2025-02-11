import { Router } from 'express';
import authRoutes from './authRoutes';
//import basicAuthRoutes from './basicAuthRoutes';
const router = Router();
router.use("/api", authRoutes);
//router.use("/api", basicAuthRoutes);
export default router;