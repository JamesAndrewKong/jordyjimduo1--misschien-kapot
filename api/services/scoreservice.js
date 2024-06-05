const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const Score = require('../models/Score');
const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
};

app.post('/calculate', authenticate, async (req, res) => {
    // const { targetId, userId, tagsTarget, tagsSubmission } = req.body;
    // const score = calculateScore(tagsTarget, tagsSubmission);
    // const scoreEntry = new Score({ targetId, userId, score, timestamp: new Date() });

    // try {
    //     await scoreEntry.save();
    //     res.json(scoreEntry);
    // } catch (error) {
    //     res.status(500).send('Error saving score');
    // }
});

function calculateScore(tagsTarget, tagsSubmission) {
    const matchedTags = tagsSubmission.filter(tag => tagsTarget.includes(tag));
    return matchedTags.length; // This is a simplistic scoring mechanism
}

app.get('/scores/:targetId', authenticate, async (req, res) => {
    // if (req.user.id !== req.params.targetId) {
    //     return res.status(403).send('Access denied.');
    // }

    // try {
    //     const targetScores = await Score.find({ targetId: req.params.targetId });
    //     res.json(targetScores);
    // } catch (error) {
    //     res.status(500).send('Error retrieving scores');
    // }
});

// const PORT = process.env.PORT || 3002;
// app.listen(PORT, () => console.log(`Score Service running on port ${PORT}`));