const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
dotenv.config();
require('./passportConfig');

const app = express(); // ✅ move this up

app.use(session({
  secret: process.env.SESSION_SECRET, // Use env variable
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/user', protectedRoutes);
app.use('/api/uploads', uploadRoutes);

app.get('/', (req, res) => {
  res.send('Backend is working!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(err => console.log(err));
