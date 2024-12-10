import express from 'express';
import mainRouter from './routes/mainRouter';
import cors from 'cors';
import path from 'path';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';

dotenv.config();


const app = express();

app.use(express.json());
app.use(cors());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
}));

app.use(
    '/files',
    express.static(path.resolve(__dirname, '..', 'uploads')));

app.use('/system', mainRouter);


app.listen(process.env.PORT, () => {
    console.log("Server is running on port ");
});