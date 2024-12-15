const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const studentRoutes = require('./routes/students');
const lessonRoutes = require('./routes/lessons');

const app = express();
const PORT = 8080;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/students', studentRoutes);
app.use('/lessons', lessonRoutes);

// Route for "Students List" page
app.get('/students/list', async (req, res) => {
  const { Student } = require('./models');
  try {
    const students = await Student.findAll();
    res.render('students', { students });
  } catch (error) {
    console.error('Error loading students:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Default route for homepage
app.get('/', async (req, res) => {
  const { Student } = require('./models');
  try {
    const students = await Student.findAll();
    res.render('index', { students });
  } catch (error) {
    console.error('Error loading homepage:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});