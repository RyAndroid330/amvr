const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
// const testRoutes = require('./routes/test');
const adminRoutes = require('./routes/admin');
const postRoutes = require('./routes/postRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// app.use('/api', testRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', postRoutes);

// For building dist
// app.use(express.static(path.join(path.resolve(), 'dist')));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
