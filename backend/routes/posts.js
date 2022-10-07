const express = require("express");
const multer = require("multer");

const Post = require('../models/post');
const checkauth = require("../middleware/check-auth");

const router = express.Router();

const MINE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination:  (req, file, cb) => {
    const isValid = MINE_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MINE_TYPE_MAP[file.mimetype];
    cb(null, name + '-'+ Date.now() + '.'+ ext);
  }
});

router.post("", checkauth, multer({storage: storage}).single("image") ,(req, res, next) => {

  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });

  console.log(post);
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      post: {
        ...createdPost,
        id: createdPost._id,
        // title: createdPost.title,
        // content: createdPost.content,
        // imagePath: createdPost.imagePath
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a post failed!"
    });
  });
});

// app.use((req, res, next) => {
//   console.log('First middleware');
//   next();
// });


router.get('',(req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  postQuery.then(documents => {
    fetchedPosts = documents;
    return Post.count();
  })
  .then(count => {
    res.status(200).json({
      message: 'Post fetched succesfully!',
      posts: fetchedPosts,
      maxPosts: count
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching a post failed!"
    });
  });
});

router.put("/:id", checkauth, multer({storage: storage}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url  + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });

  Post.updateOne({_id: req.params.id, creator: req.userData.userId }, post).then(result => {
    if (result.modifiedCount > 0) {
      res.status(200).json({message: 'Update successful!'});
    }
    else {
      res.status(401).json({message: 'Not Authorised!'})
    }


  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update post!"
    });
  })
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json( { message: 'Post not found!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching a post failed!"
    });
  });
});


router.delete("/:id", checkauth, (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId }).then(result => {
    console.log(result);
    if (result.deletedCount > 0) {
      res.status(200).json({message: 'Deleted successful!'});
    }
    else {
      res.status(401).json({message: 'Not Authorised!'})
    }
    // res.status(200).json({ message: "Post Deleted"});
  }).catch(error => {
    res.status(500).json({
      message: "Deleting a post failed!"
    });
  });
});


module.exports = router;
