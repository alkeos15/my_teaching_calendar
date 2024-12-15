const express = require('express');
const router = express.Router();

// Example route for calendar
router.get('/', (req, res) => {
  res.render('calendar', { title: 'Calendar View' });
});

module.exports = router; // Ensure this is exporting the router