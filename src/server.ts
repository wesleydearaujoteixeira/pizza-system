import express from 'express';
import mainRouter from './routes/mainRouter';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/system', mainRouter);


app.listen(3333, () => {
    console.log("Server is running on port http://localhost:3333");
});