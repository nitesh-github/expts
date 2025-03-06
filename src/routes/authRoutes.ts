import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { register, login, getUser, getUserList, uploadUserCSV} from '../controllers/userControllers';
import { getProducts } from '../controllers/productController';
import multerUpload from '../middlewares/multerUpload';
const authRoutes = Router();
// User Routes
authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.use(authMiddleware);
authRoutes.get("/get-user", getUser);
authRoutes.get("/get-user-list", getUserList);
authRoutes.post("/upload-user-csv", multerUpload.single('user_csv'),uploadUserCSV);

// Product Routes
authRoutes.get("/products",getProducts);
export default authRoutes;