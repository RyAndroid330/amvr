const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

//Import routes
// const testRoutes = require('./routes/test');
const adminRoutes = require('./routes/adminRoutes');
const postRoutes = require('./routes/postRoutes');
const profileRoutes = require('./routes/profile');
const authRoutes = require('./routes/authRoutes');
const newUserRoutes = require('./routes/newUserRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Define specific routes first
// app.use('/api', testRoutes);
app.use('/api/register', newUserRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postRoutes); // Keep more general routes last

// For building dist
app.use(express.static(path.join(path.resolve(), 'dist')));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
