import mongoose, { Schema, Model, Document, Types } from "mongoose";

interface Rating {
    rate: number;
    count: number;
}
interface IProduct extends Document {
    title: string;
    price: number,
    description?: string,
    image?: string,
    rating?: Rating,
    mainCategory: Types.ObjectId,
    categories: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

const RatingSchema: Schema = new Schema({
    rate: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
});


// Define the User schema
const ProductSchema: Schema<IProduct> = new Schema<IProduct>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        price: { type: Number, required: true },
        description: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
            trim: true,
        },

        rating: {
            type: Object,
            default: () => ({ rate: 0, count: 0 }),
        },
        mainCategory: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

// Create the User model
const Product: Model<IProduct> = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;