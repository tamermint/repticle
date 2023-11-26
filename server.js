const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Define routes
app.get('/hello-near', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'hello-near.html'));
});
app.get('/why-kyc', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'why-kyc.html'));
});
app.get('/components', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'components.html'));
});

// All other routes should redirect to the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
