import express from 'express';
import { MongoClient } from 'mongodb';

// PUT /articles/learn-react/upvote

const app = express();
app.use(express.json());

app.get('/api/articles/:name', async (req, res) => {
  const { name } = req.params;

  const client = new MongoClient('mongodb://127.0.0.1:27017');
  await client.connect();

  const db = client.db('react-blog-DB');

  const article = await db
    .collection('articles')
    .findOne({ name: name });

  if (article) {
    res.json(article);
  } else {
    res.sendStatus(404);
  }
});

app.put('/api/articles/:name/upvote', (req, res) => {
  const { name } = req.params;
  const article = articlesInfo.find((a) => a.name === name);
  if (article) {
    article.upvotes += 1;
    res.send(
      `The ${name} article now has ${article.upvotes} upvotes.`
    );
  } else {
    res.send("That article doesn't exist.");
  }
});

app.put('/api/articles/:name/downvote', (req, res) => {
  const { name } = req.params;
  const article = articlesInfo.find((a) => a.name === name);
  if (article) {
    article.upvotes -= 1;
    res.send(
      `The ${name} article now has ${article.upvotes} upvotes.`
    );
  } else {
    res.send("That article doesn't exist.");
  }
});

app.post('/api/articles/:name/comments', (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;

  const article = articlesInfo.find((a) => a.name === name);

  if (article) {
    article.comments.push({ postedBy, text });
    res.send(article.comments);
  } else {
    res.send('Article does not exist.');
  }
});

app.listen(8000, () => {
  console.log("I'm listening...");
});
