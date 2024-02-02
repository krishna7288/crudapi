const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://sujathavenkatesh010:8pWaXJZ6gwvEXmWG@cluster0.b6uo0zj.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;  

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);  
});

db.once('open', () => {
  console.log('MongoDB connected successfully!');
});

// Define the data model (Person in this case)
const personSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  id:String,
  mobileNumber: String,
  email: String,
  password: String,
});

const Person = mongoose.model('Person', personSchema);

app.get('/api/people', async (req, res) => {
    try {
      const people = await Person.find();
      res.json(people);
    } catch (error) {
      console.error('Error fetching people:', error);
      res.status(500).json({ error: 'Error fetching people' });
    }
  });
  
  app.post('/api/people', async (req, res) => {
    const personData = req.body;
  
    try {
      // Implement data validation here if needed
  
      const newPerson = new Person(personData);
      await newPerson.save();
      res.json(newPerson);
    } catch (error) {
      console.error('Error adding person:', error);
      res.status(500).json({ error: 'Error adding person' });
    }
  });
  
  app.put('/api/people/:id', async (req, res) => {
    const { id } = req.params;
    const updatedPersonData = req.body;
  
    try {
      // Implement data validation here if needed
  
      // Check if id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ObjectId format' });
      }
  
      // Convert the string ID to ObjectId
      const objectId = new mongoose.Types.ObjectId(id);
  
      const existingPerson = await Person.findById(objectId);
  
      if (!existingPerson) {
        return res.status(404).json({ error: 'Person not found' });
      }
  
      // Update the fields individually
      existingPerson.firstName = updatedPersonData.firstName;
      existingPerson.lastName = updatedPersonData.lastName;
      existingPerson.mobileNumber = updatedPersonData.mobileNumber;
      existingPerson.email = updatedPersonData.email;
      existingPerson.password = updatedPersonData.password;
  
      // Save the updated document
      const updatedPerson = await existingPerson.save();
  
      res.json(updatedPerson);
    } catch (error) {
      console.error('Error updating person:', error);
      res.status(500).json({ error: 'Error updating person', details: error.message });
    }
  });
  
  app.delete('/api/people/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await Person.findByIdAndDelete(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting person:', error);
      res.status(500).json({ error: 'Error deleting person' });
    }
  });
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
