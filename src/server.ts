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
  origin: (origin, callback) => {
      const allowedOrigins = ['http://3.110.27.149','http://3.110.27.149:4000', 'http://3.110.27.149:3000'];
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  },
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/', router);

app.get('/', (req: Request, res: Response) => {
  res.send(`Hello, MERN with TypeScript! 11. Server is running on port ${PORT}`);
});

// Connect to MongoDB using Mongoose
mongoose.connect(DB_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
