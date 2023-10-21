import express from 'express';
import mongoose, { mongo } from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js'

dotenv.config();
const app = express();
mongoose.connect(process.env.MONGO).then(
    () => {
        console.log("Connected to DB!");
    }
).catch(
    (err) => {
        console.log(err);
    }
);

app.listen(3000, () => {
    console.log("sever is running on port 3000");
})

app.use('/api/user', userRouter);
