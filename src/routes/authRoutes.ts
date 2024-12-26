import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { getUser } from '../controllers/userControllers';
const authRoutes = Router();
authRoutes.use(authMiddleware);
authRoutes.post("/get-user", getUser);
export default authRoutes;