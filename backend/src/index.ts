import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import { donorAuthRoutes } from './routes/donor/authRoute';

dotenv.config();


const app = express();
const PORT = process.env.PORT;


app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.json());


app.use('/api/donor/auth', donorAuthRoutes);

app.get('/', (req, res) => {
  res.send('Hello, welcome to the ekekiyans gang with typeScript and Express!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});