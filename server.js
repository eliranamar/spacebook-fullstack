var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/spacebookDB', function () {
  console.log("DB connection established!!!");
})

var Post = require('./models/postModel');

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))


// You will need to create 5 server routes
// These will define your API:

// 1) to handle getting all posts and their comments
app.get('/posts', function (req, res) {
  Post.find(function (err, posts) {
    if (err) console.log(err);
    else {
      console.log('==================================');
      console.log('------FETCHING POSTS FROM DB------');
      console.log('==================================');

      res.json(posts);
    }
  })
})
// 2) to handle adding a post
app.post('/posts', function (req, res) {
  var postToSave = new Post(req.body);
  console.log(postToSave);
  postToSave.save(function (err) {
    if (err) console.log(err);
    else {
      console.log("+++++++++++++++++++++++++++++++");
      console.log('----------POST SAVED!----------');
      console.log("+++++++++++++++++++++++++++++++");
    }
  });
  res.send(postToSave);
})
// 3) to handle deleting a post
app.delete('/posts/:_id', function (req, res) {
  Post.findByIdAndRemove(req.params._id, function (err) {
    if (err) console.log(err);
    else {
      console.log("+++++++++++++++++++++++++++++++");
      console.log("---------POST DELETED!---------");
      console.log("+++++++++++++++++++++++++++++++");
      res.send('success');
    }
  })
})
// 4) to handle adding a comment to a post
app.post('/posts/:_id/comments', function (req, res) {
  Post.findById(req.params._id, function (err, post) {
    if (err) console.log(err);
    else {
      post.comments.push(req.body);
      post.save(function () {

        Post.findById(req.params._id, function (err, post) {
          if (err) console.log(err);
          else {
            console.log("+++++++++++++++++++++++++++++++");
            console.log('--------COMMENT SAVED!--------');
            console.log("+++++++++++++++++++++++++++++++");
            res.json(post.comments);
          }
        });
      });
    }
  });

})
// 5) to handle deleting a comment from a post
app.delete('/posts/:post_id/comments/:comment_id', function (req, res) {
  Post.update({
    _id: req.params.post_id
  }, {
    $pull: {
      comments: {
        _id: req.params.comment_id
      }
    }
  }, function (err, post) {
    if (err) console.log(err);
    else {
      console.log(post);
      res.send(post);
    }
  });
})

app.listen(8000, function () {
  console.log("what do you want from me! get me on 8000 ;-)");
});