const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname)));

app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

function checkPageForLink(req, res, next) {
  const url = req.url;
  if (url === '/level/1' || url === '/level/2' || url === '/level/3') {
    res.sendFile(path.join(__dirname, 'public', 'level.html'));
  } else {
    next(); // Pass control to the next middleware
  }
}

// Catch-all route for serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
