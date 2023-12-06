const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
     candidateName: { type: String, },
     candidateID: { type: String, },
     schoolID: { type: String, },
     gender: { type: String, },
     dob: { type: String, },
     age: { type: Number, },
     candidateClass: { type: String, },
     dominantSide: { type: String, },
     parentName: { type: String, },
     parentMobileNo: { type: String, },
     alternateNo: { type: String, },
     email: {
          type: String,
          Unique: true,
     },
     residenceArea: { type: String, },
     residenceCity: { type: String, },
     pastInjury: { type: String, },
     presentInjury: { type: String, },
}, {
     timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

export default Student;