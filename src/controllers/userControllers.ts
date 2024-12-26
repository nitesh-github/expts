import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response):Promise<any> => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ status: false, message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    res.status(200).json({ status: true,token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: 'Error registering user' });
  }
};

export const login = async (req: Request, res: Response):Promise<any> => {
  const { email, password } = req.body;
  try {
    console.log(email);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ status: false,message: 'Invalid credentials' });

    if(user?.password){
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ status: false, message: 'Invalid credentials' });
    }    

    const token = jwt.sign({ userId: user?._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });
    let userinfo = {
      _id:user?._id,
      name:user?.name,
      email:user?.email
    }
    return res.status(200).json({ status: true, token, data : userinfo, message: 'User logged in successfully.' });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Error logging in' });
  }
};

export const getUser = async (req: Request, res: Response):Promise<any> => {
  try {
    return res.status(200).json({ status: true, user: req.user });
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Error fetching user profile' });
  }
};
