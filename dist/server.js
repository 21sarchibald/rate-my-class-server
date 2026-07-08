"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import the express library
const express = require('express');
// Initialize the express application
const app = express();
// Define a network port
const PORT = process.env.PORT || 3000;
// Middleware to automatically parse incoming JSON requests
app.use(express.json());
// Create a basic "GET" route for testing
app.get('/', (req, res) => {
    res.json({ message: "Backend is running successfully!" });
});
// Start the server and listen for requests
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
