const express = require("express");
const app = express();
const cors = require('cors');


// Connect to Database
const connectDB = require('./config/db');
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// CORS
app.use(cors())

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/exertion', require('./routes/api/exertion'));

// Init Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started listening on ${PORT}.`));