var SpacebookApp = function () {

  var posts = [];

  var $posts = $(".posts");

  var fetchPosts = function () {
    $.ajax('/posts', {
      type: "GET",
      success: function (data) {
        posts = data;
        console.log(data);
        _renderPosts();
      },
      error: function (data) {
        console.log('Error: ' + data);
      }
    });
  };

  var sendPost = function (newPost) {
    $.ajax('/posts', {
      type: "POST",
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(newPost),
      success: function (data) {
        // console.log(data);
        posts.push(data);
        // console.log(posts);
        _renderPosts();
      },
    });
  }
  var sendComment = function (newComment, index) {
    $.ajax('/posts/' + posts[index]._id + '/comments/', {
      type: "POST",
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(newComment),
      success: function (commentsData) {
        posts[index].comments = [];
        posts[index].comments = (commentsData);
        _renderComments(index);
      },
    });
  };

  var deletePost = function (index) {
    console.log(posts[index]._id);

    $.ajax('/posts/' + posts[index]._id, {
      type: "DELETE",
      success: function () {
        posts.splice(index, 1);
        _renderPosts();
      },
    });
  };

  var deleteComment = function (postIndex, commentIndex) {
    $.ajax('/posts/' +
      posts[postIndex]._id +
      '/comments/' +
      posts[postIndex].comments[commentIndex]._id, {
        type: "DELETE",
        success: function () {
          posts[postIndex].comments.splice(commentIndex, 1);
          _renderComments(postIndex);
        },
      });
  };

  function _renderPosts() {
    $posts.empty();
    var source = $('#post-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts.length; i++) {
      var newHTML = template(posts[i]);
      $posts.append(newHTML);
      _renderComments(i)
    }
  }

  function _renderComments(postIndex) {
    var post = $(".post")[postIndex];
    $commentsList = $(post).find('.comments-list')
    $commentsList.empty();
    var source = $('#comment-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts[postIndex].comments.length; i++) {
      var newHTML = template(posts[postIndex].comments[i]);
      $commentsList.append(newHTML);
    }
  }
  return {
    deletePost: deletePost,
    sendComment: sendComment,
    deleteComment: deleteComment,
    fetchPosts: fetchPosts,
    sendPost: sendPost,
    _renderPosts: _renderPosts
  };
};

var app = SpacebookApp();

$('#addpost').on('click', function () {
  var $input = $("#postText");
  if ($input.val() === "") {
    alert("Please enter text!");
  } else {
    var newPost = {
      "text": $input.val(),
      "comments": []
    }
    app.sendPost(newPost);
    $input.val("");
  }
});

var $posts = $(".posts");

$posts.on('click', '.remove-post', function () {
  var index = $(this).closest('.post').index();
  app.deletePost(index);
});

$posts.on('click', '.toggle-comments', function () {
  var $clickedPost = $(this).closest('.post');
  $clickedPost.find('.comments-container').toggleClass('show');
});

$posts.on('click', '.add-comment', function () {

  var $comment = $(this).siblings('.comment');
  var $user = $(this).siblings('.name');

  if ($comment.val() === "" || $user.val() === "") {
    alert("Please enter your name and a comment!");
    return;
  }

  var postIndex = $(this).closest('.post').index();
  var newComment = {
    text: $comment.val(),
    user: $user.val()
  };

  app.sendComment(newComment, postIndex);

  $comment.val("");
  $user.val("");

});

$posts.on('click', '.remove-comment', function () {
  var $commentsList = $(this).closest('.post').find('.comments-list');
  var postIndex = $(this).closest('.post').index();
  var commentIndex = $(this).closest('.comment').index();

  app.deleteComment(postIndex, commentIndex);
});

app.fetchPosts();