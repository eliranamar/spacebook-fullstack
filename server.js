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
    console.log('==================================');
    console.log(posts);
    console.log('==================================');
    res.json(posts);
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

})
// 5) to handle deleting a comment from a post
app.delete('deletecomment', function (req, res) {

})

app.listen(8000, function () {
  console.log("what do you want from me! get me on 8000 ;-)");
});