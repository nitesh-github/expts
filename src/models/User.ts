import mongoose, { Schema, Document, Model } from 'mongoose';

// Define an interface for the User document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt?: Date; // Optional property
  updatedAt?: Date; // Optional property
}

// Define the User schema
const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the User model
const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
