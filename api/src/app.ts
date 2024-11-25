import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import CookieParser from 'cookie-parser';
import httpStatus from 'http-status';
import ApiError from './errors/apiError';
import router from './app/routes';
import config from './config';
import dotenv from 'dotenv';
import mongoose from "mongoose";

const app: Application = express();

app.use(cors());
app.use(CookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
dotenv.config();

mongoose.set("strictQuery", true);

const connect = async () => {
    try {
      await mongoose.connect("mongodb+srv://mepal:medpal@cluster0.aj4cy5y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
      console.log("Connected to mongoDB!");
    } catch (error) {
      console.log(error);
    }
  };

  connect();
app.get('/favicon.ico', (req: Request, res: Response) => {
    res.status(204).end();
})

app.get('/', (req: Request, res: Response) => {
    res.send(config.clientUrl)
})

app.use('/api/v1', router);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({ success: false, message: err.message })
    } else {
        res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: 'Something Went Wrong',
        });
    }
    next();
})

export default app;