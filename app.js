const express = require("express");
const app = express();
const cors = require('cors');
const path = require('path');


// Connect to Database
const connectDB = require('./config/db');
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// CORS
app.use(cors())

// Define Routes
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/exertion', require('./routes/api/exertion'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  });
}

// Init Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started listening on ${PORT}.`));