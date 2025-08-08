const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Data file path
const dataFile = path.join(__dirname, 'data', 'taps.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(dataFile))) {
    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFile)) {
    const initialData = {
        communityTaps: 0,
        lastReset: new Date().toISOString()
    };
    fs.writeFileSync(dataFile, JSON.stringify(initialData, null, 2));
}

// Routes
app.get('/api/taps', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        res.json({
            communityTaps: data.communityTaps,
            lastReset: data.lastReset
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to read taps data' });
    }
});

app.post('/api/tap', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        
        // Increment community taps
        data.communityTaps++;
        
        // Save updated data
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
        
        res.json({
            success: true,
            communityTaps: data.communityTaps
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update taps' });
    }
});

app.post('/api/reset', (req, res) => {
    try {
        const data = {
            communityTaps: 0,
            lastReset: new Date().toISOString()
        };
        
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
        
        res.json({
            success: true,
            communityTaps: 0
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reset taps' });
    }
});

// Serve the main page and handle all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 RUGGY Tapper Server running on port ${PORT}`);
    console.log(`🌐 Visit: http://localhost:${PORT}`);
}); 
