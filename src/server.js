import express from 'express';
import { db, connectToDb } from './db.js';
// PUT /articles/learn-react/upvote

const app = express();
app.use(express.json());

app.get('/api/articles/:name', async (req, res) => {
  const { name } = req.params;

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
    res.send(
      `The ${name} article now has ${article.upvotes} upvotes.`
    );
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
    res.send(
      `The ${name} article now has ${article.upvotes} upvotes.`
    );
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
    res.send(article.comments);
  } else {
    res.send('Article does not exist.');
  }
});

connectToDb(() => {
  console.log("I'm listening...(database connected successfully)");
  app.listen(8000, () => {
    console.log(
      "I'm listening...(server is listening on port 8000)"
    );
  });
});
