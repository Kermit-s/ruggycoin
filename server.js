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

// Persistence configuration
// Option 1 (default): JSON file on disk (works locally or on hosts with persistent disk)
// Option 2: Redis (recommended for ephemeral filesystems such as serverless or dyno-based hosts)
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const dataFile = path.join(DATA_DIR, 'taps.json');
const useRedis = !!process.env.REDIS_URL;
let redis = null;
if (useRedis) {
    try {
        const Redis = require('ioredis');
        redis = new Redis(process.env.REDIS_URL);
    } catch (err) {
        console.error('Failed to initialize Redis client. Falling back to file storage.', err);
    }
}

// Ensure data directory exists for file storage
if (!useRedis || !redis) {
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
}

// Storage helpers
async function readData() {
    // Prefer Redis if configured and available
    if (useRedis && redis) {
        try {
            const json = await redis.get('ruggy:taps');
            if (json) {
                return JSON.parse(json);
            }
            const initialData = { communityTaps: 0, lastReset: new Date().toISOString() };
            await redis.set('ruggy:taps', JSON.stringify(initialData));
            return initialData;
        } catch (err) {
            console.error('Redis read failed, falling back to file storage.', err);
        }
    }
    // File storage
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    return data;
}

async function writeData(data) {
    // Prefer Redis if configured and available
    if (useRedis && redis) {
        try {
            await redis.set('ruggy:taps', JSON.stringify(data));
            return;
        } catch (err) {
            console.error('Redis write failed, falling back to file storage.', err);
        }
    }
    // File storage
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// Routes
app.get('/api/taps', async (req, res) => {
    try {
        const data = await readData();
        res.json({
            communityTaps: data.communityTaps,
            lastReset: data.lastReset
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to read taps data' });
    }
});

app.post('/api/tap', async (req, res) => {
    try {
        const data = await readData();
        data.communityTaps++;
        await writeData(data);
        res.json({
            success: true,
            communityTaps: data.communityTaps
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update taps' });
    }
});

app.post('/api/reset', async (req, res) => {
    try {
        const data = {
            communityTaps: 0,
            lastReset: new Date().toISOString()
        };
        await writeData(data);
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
