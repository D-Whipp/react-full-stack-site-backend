import express from 'express';
import { db, connectToDb } from './db.js';
import fs from 'fs';
import admin from 'firebase-admin';

const credentials = JSON.parse(
  fs.readFileSync('../credentials.json')
);

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

// PUT /articles/learn-react/upvote

const app = express();
app.use(express.json());

app.use(async (req, res, next) => {
  const { authtoken } = req.headers;

  if (authtoken) {
    try {
      const user = await admin.auth().verifyIdToken(authtoken);
      req.user = user;
    } catch (e) {
      res.sendStatus(400);
    }
  }

  next();
});

app.get('/api/articles/:name', async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  const article = await db
    .collection('articles')
    .findOne({ name: name });

  if (article) {
    const upvoteIds = article.upvoteIds || [];
    article.canUpvote = uid && !upvoteIds.include(uid);
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
