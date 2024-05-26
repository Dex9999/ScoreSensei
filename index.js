const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(path.join(__dirname + '/images')));
console.log(path.join(__dirname + '/public'));
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

//redirect path to hash
// app.use((req, res, next) => {
//   if (!req.originalUrl.includes("#")) {
//     req.redirect = `/#${req.originalUrl.slice(1)}`;
//   }
//   next();
// });

async function checkPageForLink(req, res) {
  const url = req.url;
  if (url === '/level/1' ||url === '/level/2' ||url === '/level/3'){
    const html = fs.readFileSync('public/level.html', 'utf8');
    res.send(html);
  } else{
    const html = fs.readFileSync('public/index.html', 'utf8');
    res.send(html);
}
//for any path give index.html (doesn't work?)
app.get('*', checkPageForLink);
  
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
