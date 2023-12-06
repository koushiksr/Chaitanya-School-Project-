const mongoose = require('mongoose');

const assessorSchema = new mongoose.Schema({
     name: { type: String, required: true },
     address: { type: String, required: true },
     phNO: { type: String, required: true },
     assessorID: { type: String, required: true },
     email: { type: String, required: true, unique: true },
}, {
     timestamps: true
});

const Assessor = mongoose.model('Assessor', assessorSchema);

export default Assessor;