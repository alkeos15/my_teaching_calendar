const express = require('express');
const { Student } = require('../models');
const router = express.Router();

// Get all students as JSON
router.get('/', async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Render the student list page
router.get('/list', async (req, res) => {
  try {
    const students = await Student.findAll();
    res.render('students-list', { students });
  } catch (error) {
    console.error('Error fetching students for list page:', error);
    res.status(500).json({ error: 'Failed to load student list page' });
  }
});

// Add a new student
router.post('/', async (req, res) => {
  const { name, email, phone, languageLevel } = req.body;
  try {
    const newStudent = await Student.create({ name, email, phone, languageLevel });
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(400).json({ error: 'Failed to add student' });
  }
});

// Get a specific student by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Update a student
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, languageLevel } = req.body;
  try {
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    await student.update({ name, email, phone, languageLevel });
    res.json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(400).json({ error: 'Failed to update student' });
  }
});

// Delete a student
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    await student.destroy();
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(400).json({ error: 'Failed to delete student' });
  }
});

module.exports = router;