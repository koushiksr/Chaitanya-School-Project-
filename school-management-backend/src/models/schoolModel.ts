const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
     schoolName: { type: String, required: true },
     schoolID: { type: String, required: true },
     contactName: { type: String, required: true },
     contactNo: { type: String, required: true },
     schoolEmail: { type: String, required: true, unique: true },
     schoolType: { type: String, required: true },
     schoolCity: { type: String, required: true },
     principalName: { type: String, required: true },
     principalContact: { type: String, required: true },
     principalEmail: { type: String, required: true },
     classesFrom: { type: String, required: true },
     classesTo: { type: String, required: true },
     totalStudents: { type: Number, required: true },
     noOfBoys: { type: Number, required: true },
     noOfGirls: { type: Number, required: true },
}, {
     timestamps: true
});

const School = mongoose.model('School', schoolSchema);

export default School;