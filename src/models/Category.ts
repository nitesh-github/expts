import mongoose, {Schema, Model, Document, Types} from "mongoose";


interface ICategory extends Document{
  name: string;
  parent_id?: Types.ObjectId | null;
  createdAt?: Date; 
  updatedAt?: Date; 
}

// Define the User schema
const CategorySchema: Schema<ICategory> = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    parent_id: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the User model
const Category: Model<ICategory> = mongoose.model<ICategory>('Category', CategorySchema);

export default Category;