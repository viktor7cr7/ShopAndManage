import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import {dirname} from 'path'
const app = express();
import { dbConnect } from './dbConnect.js';
import { dbConnectAdmin } from './dbConnect.js';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import cloudinary from 'cloudinary';

import authRouter from './routers/authRoutes.js';
import controlProductAdmin from './routers/controlProductAdmin.js';
import adminRouter from './routers/adminRoutes.js';
import paymentRouter from './routers/paymentRoutes.js';
import userRouter from './routers/userRoutes.js';
import { authenticateAdmin, authenticateUser } from './middleware/authMiddleware.js';
import cookieParser from 'cookie-parser';
import { StatusCodes } from 'http-status-codes';
import { fileURLToPath } from 'url';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

  
app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT || 3005;
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/admin', authenticateAdmin, controlProductAdmin, adminRouter);
app.use('/api/v1', authenticateUser, userRouter);
app.use('/api/v1', paymentRouter)

const __dirname = dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.resolve(__dirname, './public')))
app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, './public', 'index.html'))
})
app.use('*', (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({
        msg: 'Указанного пути не существует',
    });
});

app.use(errorHandlerMiddleware);


(async function () {
    try {
        await dbConnectAdmin.connect();
        app.listen(port, () => {
            console.log(`server starting with port ${port}`);
        });
    } catch (error) {
        console.log(`error message ${error}`);
    }
})();
