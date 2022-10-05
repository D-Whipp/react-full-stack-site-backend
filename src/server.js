import express from 'express';

const app = express();

app.get('/hello', (req, res) => {
  res.send('Hello!');
});

app.listen(8000, () => {
  console.log("I'm listening...");
});
