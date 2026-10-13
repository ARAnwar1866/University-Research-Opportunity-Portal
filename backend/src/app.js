const express = require('express');
const cors = require('cors');
const opportunityRoutes = require('./routes/opportunityRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/opportunities', opportunityRoutes);

// Unknown route -> 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Central error handler
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
