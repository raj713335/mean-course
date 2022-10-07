const express = require("express");


const Post = require('../models/post');

const checkauth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const PostController = require("../controllers/posts");

const router = express.Router();



router.post("", checkauth, extractFile, PostController.CreatePost);

// app.use((req, res, next) => {
//   console.log('First middleware');
//   next();
// });


router.get('', PostController.getPosts);

router.put("/:id", checkauth, extractFile, PostController.UpdatePost);

router.get("/:id", PostController.getPostById);


router.delete("/:id", checkauth, PostController.deletePost);


module.exports = router;
