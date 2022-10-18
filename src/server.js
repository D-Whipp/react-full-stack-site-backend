import express from 'express';
import { MongoClient } from 'mongodb';
import { db, connectToDb } from './db.js';
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

app.put('/api/articles/:name/upvote', async (req, res) => {
  const { name } = req.params;

  await db.collection('articles').updateOne(
    { name },
    {
      $inc: { upvotes: 1 },
    }
  );
  const article = await db.collection('articles').findOne({ name });

  if (article) {
    res.json(article);
  } else {
    res.send("That article doesn't exist.");
  }
});

app.put('/api/articles/:name/downvote', async (req, res) => {
  const { name } = req.params;

  await db.collection('articles').updateOne(
    { name },
    {
      $inc: { upvotes: -1 },
    }
  );

  const article = await db.collection('articles').findOne({ name });

  if (article) {
    res.send(article);
  } else {
    res.send("That article doesn't exist.");
  }
});

app.post('/api/articles/:name/comments', async (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;

  await db.collection('articles').updateOne(
    { name },
    {
      $push: { comments: { postedBy, text } },
    }
  );

  const article = await db.collection('articles').findOne({ name });

  if (article) {
    res.json(article);
  } else {
    res.send('Article does not exist.');
  }
});

connectToDb(() => {
  console.log("I'm listening...(database connected successfully)");
  app.listen(8000, () => {
    console.log("I'm listening...(server is listening on port 8000)");
  });
});
