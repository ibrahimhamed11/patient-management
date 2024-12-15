const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nationalId: { type: String, required: false }, 
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  address: { type: String, required: true },
  history: { type: String, required: true },
  testField: { type: String, required: false },
  absorbance: { type: String, default: ''}, 
  concentration: { type: String, default:''} 
});

// Ensure no unique index on nationalId
PatientSchema.index({ nationalId: 1 }, { unique: false });

module.exports = mongoose.model('Patient', PatientSchema);
