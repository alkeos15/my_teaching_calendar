const express = require('express');
const { Lesson } = require('../models');
const router = express.Router();

// Get all lessons
router.get('/', async (req, res) => {
  try {
    const lessons = await Lesson.findAll();
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// Add a new lesson
router.post('/', async (req, res) => {
  const { title, start, end, studentId } = req.body;
  try {
    const lesson = await Lesson.create({ title, start, end, studentId });
    res.json(lesson);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add lesson' });
  }
});

module.exports = router;
