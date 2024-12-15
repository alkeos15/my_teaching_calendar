const express = require('express');
const { Lesson } = require('../models');
const router = express.Router();

// Get all lessons
router.get('/', async (req, res) => {
  try {
    const lessons = await Lesson.findAll();
    res.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// Add a new lesson
router.post('/', async (req, res) => {
  const { title, start, end, studentId, recurrence } = req.body;
  try {
    const lesson = await Lesson.create({ title, start, end, studentId, recurrence });
    res.json(lesson);
  } catch (error) {
    console.error('Error adding lesson:', error);
    res.status(400).json({ error: 'Failed to add lesson' });
  }
});

// Update a lesson
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, start, end, studentId, recurrence } = req.body;
  try {
    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    await lesson.update({ title, start, end, studentId, recurrence });
    res.json(lesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(400).json({ error: 'Failed to update lesson' });
  }
});

// Delete a lesson
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    await lesson.destroy();
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(400).json({ error: 'Failed to delete lesson' });
  }
});

module.exports = router;