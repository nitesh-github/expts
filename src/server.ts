import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import router from './routes/routes';
import cors from 'cors';
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;
const DB_URL = process.env.DBURL;

const corsOptions = {
  origin: 'http://3.110.27.149', // Allow requests from React app on localhost:3000
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/', router);

app.get('/', (req: Request, res: Response) => {
  res.send(`Hello, MERN with TypeScript! 10. Server is running on port ${PORT}`);
});

// Connect to MongoDB using Mongoose
mongoose.connect(DB_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
