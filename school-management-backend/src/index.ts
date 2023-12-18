import express from 'express';
import cors from 'cors';
import loginRouter from './routes/loginRoute';
import adminRouter from './routes/adminRoute';
import schoolRouter from './routes/schoolRoute';
import studentRouter from './routes/studentRoute';
import assessorRoute from './routes/assessorRoute';
const mongoose = require('mongoose');

const app = express();
require('dotenv').config();
app.use(express.json());
app.options('/login', cors());
app.use(cors({
     // origin: 'http://localhost:4200',
     origin: 'https://657ff819201fdd08db6821d5--precious-chebakia-62c032.netlify.app/',
     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
     credentials: true,
}));

app.use('/login', loginRouter)
app.use('/admin', adminRouter)
app.use('/assessor', assessorRoute)
app.use('/school', schoolRouter)
app.use('/student', studentRouter)

mongoose.connect(process.env.mongoURL, {}).then(() => console.log('Connected to MongoDB'))
     .catch((err: any) => console.error('Error connecting to MongoDB:', err))

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));