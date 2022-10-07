import express from 'express';

// PUT /articles/learn-react/upvote

const app = express();
app.use(express.json());

app.post('/hello', (req, res) => {
  console.log(req.body);
  res.send(`Hello ${req.body.name}`);
});

app.get('/hello/:name', (req, res) => {
  const { name } = req.params;
  res.send(`I'm lisening ${name}...`);
});

app.listen(8000, () => {
  console.log("I'm listening...");
});
