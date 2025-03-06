import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import path from 'path';

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
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ status: false,message: 'Invalid credentials' });

    if(user?.password){
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ status: false, message: 'Invalid credentials' });
    }    

    const token = jwt.sign({ userId: user?._id }, process.env.JWT_SECRET as string, {
      expiresIn: '24h',
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

export const getUserList = async (req:Request, res:Response):Promise<void> => {
  try {
    const page = Number(req.body?.page || req.query?.page) + 1;
    const limit = Number(req.body?.limit || req.query?.limit) || 10;
    const skip = (page - 1) * limit;
    const users = await User.find().skip(skip).limit(limit).lean();
    const totalCount  = await User.countDocuments();
    res.status(200).json({ status: true, data: {users,totalCount}});
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: 'Error fetching user profile' });
  }
};

export const uploadUserCSV = async (req:Request, res:Response) : Promise<void>=>{
  try {
    
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }
   
    const imageName = req.file.filename;
    const filePath = req.file.path;
    // Start a worker thread to process the CSV file
    const worker = new Worker(path.join(__dirname, 'worker.ts'), {
      workerData: { filePath, imageName } 
    });

    // Listen for messages from the worker thread
    worker.on('message', (result) => {
      if (result.status === 'success') {
        // Handle the successful file processing
        console.log(result.testmsg)
        return res.status(200).json({
          message: "CSV file uploaded and processed successfully!",
          data: result.data,
          test:result.testmsg
        });
      } else {
        return res.status(500).json({
          status: false,
          message: "Error processing file in worker thread.",
        });
      }
    });

    worker.on('error', (err) => {
      console.error('Worker thread error:', err);
      return res.status(500).json({
        status: false,
        message: "Error in worker thread.",
      });
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Worker thread exited with code ${code}`);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: 'Error in uploading csv data.' });
  }
  
}
