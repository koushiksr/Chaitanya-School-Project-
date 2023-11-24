const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
     email: { type: String },
     password: { type: String },
     role :{type: String}
}, {
     timestamps: true 
});

const Login = mongoose.model('Login', loginSchema);

export default Login;
