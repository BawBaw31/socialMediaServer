// Dependencies
const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');

// Middlewares imports
const serialization = require('./middlewares/serialization');

// Import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

const app = express();

// Setting IN_PROD 
let IN_PROD = true;
if(process.env.NODE_ENV !== 'production') {
    dotenv.config();
    IN_PROD = false;
}

// Connect to DB
mongoose.connect(
    process.env.DB_CONNECT, 
    { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to bd");
});

// Middleware
app.use(express.json());
app.use(cors({origin: [
    process.env.URL_FRONT
  ], credentials: true}));
app.use(session({
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60,
        sameSite: true,
        secure: IN_PROD
    }
}));

// Route Middlewares
app.use('/api/user', authRoute, serialization);
app.use('/api/posts',postRoute, serialization);

app.listen(3000, () => console.log('Server Up and runnig'));
