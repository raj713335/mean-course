const express = require('express');
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.use((req, res, next) => {
  console.log('First middleware');
  next();
});


app.use('/api/posts',(req, res, next) => {
  const posts = [
    { id: 1, title: "First Post", content: "First Server side post"},
    { id: 2, title: "Second Post", content: "Second Server side post"},
    { id: 3, title: "Third Post", content: "Third Server side post"},
  ]

  res.status(200).json({
    message: 'Post fetched succesfully!',
    posts: posts
  });
});


module.exports = app;
