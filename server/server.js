import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';

import authRouter from './routes/authRoute.js';
import blogRouter from './routes/blogRoute.js';
import adminRouter from './routes/adminRoute.js';

dotenv.config();

const app = express();

connectDB();

//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
  res.send("Welcome to NODE.JS");
});

app.use('/api/auth', authRouter);
app.use('/api/blog', blogRouter);
app.use('/api/admin', adminRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});

