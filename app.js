const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to handle JSON data from the browser
app.use(express.json());

// Serve the 'public' folder files
app.use(express.static(path.join(__dirname, 'public')));

let highScores = [];

// Route to receive a new score
app.post('/submit-score', (req, res) => {
    const { name, time } = req.body;
    
    highScores.push({ name, time });
    
    // Sort scores so the lowest time (fastest) is first
    highScores.sort((a, b) => a.time - b.time);
    
    const fastest = highScores.length > 0 ? highScores[0].time : time;
    console.log(`Score received: ${name} - ${time}ms`);
    
    res.json({ message: "Score recorded!", fastest: fastest });
});

// Route for the browser to fetch the top 5 scores
app.get('/leaderboard', (req, res) => {
    const top5 = highScores.slice(0, 5);
    res.json(top5);
});

// Route to clear all scores
app.delete('/reset-leaderboard', (req, res) => {
    highScores = []; // Empty the array
    console.log("Leaderboard has been reset.");
    res.json({ message: "Leaderboard cleared!" });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});