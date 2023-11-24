import express from 'express';
import cors from 'cors';
import loginRouter from './src/routes/loginRoute';
import adminRouter from './src/routes/adminRoute';
import schoolRouter from './src/routes/schoolRoute';
import studentRouter from './src/routes/studentRoute';

const app = express();
const mongoose = require('mongoose');
     
require('dotenv').config();
app.use(express.json());
app.options('/login', cors());

app.use(cors({
     origin: 'http://localhost:4200',
     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
     credentials: true,
}));


app.use('/login', loginRouter)
// app.use('/forgotpassword', loginRouter)
app.use('/admin', adminRouter)
app.use('/school', schoolRouter)
app.use('/student', studentRouter)



try {
     const mongoURL = 'mongodb+srv://koushik:koushik@employeedatabase.uqho6xi.mongodb.net/school?retryWrites=true&w=majority';
     mongoose.connect(mongoURL, {
     })
          .then(() => {
               console.log('Connected to MongoDB');
          })
          .catch((err: any) => {
               console.error('Error connecting to MongoDB:', err);
          });
} catch (error) {
     console.log('mongoose error', error)
}
try {

     const port = process.env.PORT || 3000;
     app.listen(port, () => {
          console.log(`Server is running on port ${port}`);
     });

} catch (error) {
     console.log('error while running on port', error)
}


