import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import Student from './src/models/Student.js';
import Query from './src/models/Query.js';
import Message from './src/models/Message.js';
import ChatMessage from './src/models/ChatMessage.js';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const dbURI = 'mongodb+srv://easwanth123:AbYIaNzfzyeXEyaF@cluster0.bkvrbcv.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB:', mongoose.connection.name);
});

app.post('/students', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  const { userType, identifier, password } = req.body;

  try {
    const user = await Student.findOne({
      $or: [{ Number: identifier }, { Email: identifier }],
      Password: password,
    });

    if (user) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid registrationNumber, email, or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/submitQuery', async (req, res) => {
  const { Name, Regarding, Description, contact } = req.body;

  try {
    const newQuery = new Query({
      Name,
      Regarding,
      Description,
      contact,
    });

    await newQuery.save();

    res.status(201).json({ message: 'Query submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/unresolvedQueries', async (req, res) => {
  try {
    const unresolvedQueries = await Query.find({ isResolved: false });
    res.status(200).json(unresolvedQueries);
  } catch (error) {
    console.error('Error fetching unresolved queries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/submitSolution/:id', async (req, res) => {
  const { id } = req.params;
  const { solution, solutionName } = req.body;

  try {
    const query = await Query.findById(id);

    if (!query) {
      console.error('Query not found');
      return res.status(404).json({ error: 'Query not found' });
    }

    query.solutions.push({ solutionText: solution, solutionName: solutionName });

    const updatedQuery = await query.save();

    console.log('Solution submitted successfully');
    res.status(200).json({ message: 'Solution submitted successfully', updatedQuery });
  } catch (error) {
    console.error('Error during solution submission:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/solvedQueries', async (req, res) => {
  try {
    const queriesWithSolutions = await Query.find({ 'solutions.0': { $exists: true } });
    res.status(200).json(queriesWithSolutions);
  } catch (error) {
    console.error('Error fetching solved queries with solutions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/messages/add', async (req, res) => {
  try {
    const { message } = req.body;
    const newMessage = new Message({ Message: message });
    await newMessage.save();
    res.json({ message: 'Message added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/messages/all', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.get('/api/solvedQueriesWithSolutions', async (req, res) => {
  try {
    const queriesWithSolutions = await Query.find({ 'solutions.0': { $exists: true } });
    res.status(200).json(queriesWithSolutions);
  } catch (error) {
    console.error('Error fetching solved queries with solutions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/setResolvedStatus/:id', async (req, res) => {
  const { id } = req.params;
  const { isResolved } = req.body;

  try {
    const updatedQuery = await Query.findByIdAndUpdate(
      id,
      { isResolved },
      { new: true }
    );

    if (updatedQuery) {
      console.log('Resolved status updated successfully');
      res.status(200).json({ message: 'Resolved status updated successfully' });
    } else {
      console.error('Query not found');
      res.status(404).json({ error: 'Query not found' });
    }
  } catch (error) {
    console.error('Error during resolved status update:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getChatMessages/:identifier/:selectedTeacherEmail', async (req, res) => {
  const { identifier, selectedTeacherEmail } = req.params;
  console.log('Identifier:', identifier);
  console.log('Selected Teacher Email:', selectedTeacherEmail);

  try {
    const chatMessages = await ChatMessage.find({
      $or: [
        { identifier, selectedTeacherEmail },
        { identifier: selectedTeacherEmail, selectedTeacherEmail: identifier }
      ]
    });

    console.log('Fetched Messages:', chatMessages);
    res.status(200).json(chatMessages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/storeChatMessages', async (req, res) => {
  const { identifier, selectedTeacherEmail, messages } = req.body;

  console.log('Received data:', { identifier, selectedTeacherEmail, messages });

  try {
    const chatMessage = new ChatMessage({
      identifier,
      selectedTeacherEmail,
      messages,
    });

    await chatMessage.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Error storing chat messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});