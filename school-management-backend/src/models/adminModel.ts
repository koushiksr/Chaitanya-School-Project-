const mongoose = require('mongoose');
// const fs = require('fs');
// const imageBuffer = fs.readFileSync('path_to_image.jpg');

const adminSchema = new mongoose.Schema({
     // image: {
     //      data: imageBuffer,
     //      contentType: 'image/jpeg',
     // },
     firstName: { type: String },
     lastName: { type: String },
     email: { type: String },
     phoneNumber: { type: String },
     password: { type: String, default: 'Admin@123' },
     
     // password: { type: String },
}, {
     timestamps: true 
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;