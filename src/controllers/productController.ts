import { Request, Response } from "express";
import Product from "../models/Product";
import Category from "../models/Category";

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = Number(req.query?.page) + 1;
        const limit = Number(req.query?.limit) || 10;
        const skip = (page - 1) * limit;
        const products = await Product.find().skip(skip).limit(limit).lean();
        const totalCount = await Product.countDocuments();
        res.status(200).json({ status: true, data: { products, totalCount } })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Something went wrong!' });
    }
}