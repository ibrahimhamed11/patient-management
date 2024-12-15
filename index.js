const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const cors = require('cors');
const path = require('path');
const Patient = require('./models/Patient');

const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect('mongodb+srv://testdata:c3g9R5uFER69VlOo@cluster0.0yqqy.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/form.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/dashboard.html'));
});

// API to add a patient
app.post('/add-patient', async (req, res) => {
  const { name, nationalId, gender, address, history, test } = req.body;

  try {
    const patient = await Patient.create({ name, nationalId, gender, address, history, test });
    res.status(201).json({ success: true, patient });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: 'Failed to add patient.' });
  }
});

// API to get all patients
app.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch patients.' });
  }
});

// API to update a patient's test results
app.put('/patients/:id', async (req, res) => {
    const { id } = req.params;
    const { absorbance, concentration } = req.body;
  
    try {
      const updatedPatient = await Patient.findByIdAndUpdate(
        id,
        { $set: { absorbance, concentration } }, // Use $set to update specific fields
        { new: true } // Return the updated document
      );
  
      if (!updatedPatient) {
        return res.status(404).json({ success: false, error: 'Patient not found.' });
      }
  
      res.json({ success: true, patient: updatedPatient });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to update patient.' });
    }
  });
  
// API to delete a patient
app.delete('/patients/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPatient = await Patient.findByIdAndDelete(id);

    if (!deletedPatient) {
      return res.status(404).json({ success: false, error: 'Patient not found.' });
    }

    res.json({ success: true, message: 'Patient deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to delete patient.' });
  }
});
app.get('/patients/:id', async (req, res) => {
    const patientId = req.params.id;
  
    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }
  
    try {
      // Assuming you're using a database like MongoDB:
      const patient = await Patient.findById(patientId);
  
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
  
      res.json(patient);
    } catch (error) {
      console.error('Error fetching patient details:', error);
      res.status(500).json({ error: 'Failed to load patient details. Please try again later.' });
    }
  });

  
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
