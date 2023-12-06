import express from 'express';
import cors from 'cors';
import loginRouter from './src/routes/loginRoute';
import adminRouter from './src/routes/adminRoute';
import schoolRouter from './src/routes/schoolRoute';
import studentRouter from './src/routes/studentRoute';
import assessorRoute from './src/routes/assessorRoute';
const mongoose = require('mongoose');

const app = express();
require('dotenv').config();
app.use(express.json());
app.options('/login', cors());
app.use(cors({
     origin: 'http://localhost:4200',
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