const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/images')));

//redirect path to hash
// app.use((req, res, next) => {
//   if (!req.originalUrl.includes("#")) {
//     req.redirect = `/#${req.originalUrl.slice(1)}`;
//   }
//   next();
// });

//for any path give index.html (doesn't work?)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/level/1', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/level1.html'));
});
app.get('/level/2', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/level2.html'));
});
app.get('/level/3', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/level3.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
