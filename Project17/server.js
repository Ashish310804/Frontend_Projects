const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Data file path
const dataFile = path.join(__dirname, 'readings.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([]));
}

// Routes
app.get('/api/readings', (req, res) => {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    const readings = JSON.parse(data).map(r => ({ ...r, date: new Date(r.date) }));
    res.json(readings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load readings' });
  }
});

app.post('/api/readings', (req, res) => {
  try {
    const { pressure, date } = req.body;
    if (typeof pressure !== 'number' || isNaN(new Date(date))) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const data = fs.readFileSync(dataFile, 'utf8');
    const readings = JSON.parse(data);
    readings.unshift({ pressure, date });

    // Keep only last 100 readings
    if (readings.length > 100) {
      readings.splice(100);
    }

    fs.writeFileSync(dataFile, JSON.stringify(readings.map(r => ({ ...r, date: r.date.toISOString() }))));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save reading' });
  }
});

app.delete('/api/readings/:index', (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const data = fs.readFileSync(dataFile, 'utf8');
    const readings = JSON.parse(data);

    if (index < 0 || index >= readings.length) {
      return res.status(400).json({ error: 'Invalid index' });
    }

    readings.splice(index, 1);
    fs.writeFileSync(dataFile, JSON.stringify(readings));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete reading' });
  }
});

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Saathi.html'));
});

app.listen(PORT, () => {
  console.log(`Saathi server running on http://localhost:${PORT}`);
});