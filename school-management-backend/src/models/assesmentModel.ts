const mongoose = require('mongoose');

const assesmentSchema = new mongoose.Schema({
     candidateID: { type: String },
     candidateName: { type: String },
     gender: { type: String },
     DOB:{},
     height_cms:{type:String},
     height_cms_rating:{},
     weight_KG:{}

}, {
     timestamps: true 
});

const Assesment = mongoose.model('Assesment', assesmentSchema);

export default Assesment;