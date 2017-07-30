const express = require('express');
const router = express.Router();
let Blog = require('../models/blog');


router.get('/articles', function(req, res, next) {
  Blog.find({'type': { $eq: true }}, function(err, cikkek) {
    let blogChunks = [];
    let chunkSize = 4;
    for (let i = 0; i < cikkek.length; i += chunkSize) {
      blogChunks.push(cikkek.slice(i, i + chunkSize));
    }
    res.render('blog/articles', {title: 'Cikkek', cikkek: blogChunks});
  });
});

router.get('/news', function(req, res, next) {
  Blog.find({'type': { $eq: false }}, function(err, cikkek) {
    let blogChunks = [];
    let chunkSize = 4;
    for (let i = 0; i < cikkek.length; i += chunkSize) {
      blogChunks.push(cikkek.slice(i, i + chunkSize));
    }
    res.render('blog/news', {title: 'Hírek', cikkek: blogChunks});
  });
});


router.get('/add', function(req, res, next) {
  res.render('blog/add_blog', { title: 'Új Cikkek', foot: true });
});

router.post('/add', function(req, res, next) {
  req.checkBody('title', 'Cím nélkül nem teheted közzé!').notEmpty();
  req.checkBody('author', 'A szerzőt fel kell tüntetni!').notEmpty();
  req.checkBody('body', 'Meg kell adnon tartalmat!').notEmpty();
  var errors = req.getValidationResult().then(function(result) {
    if (result.array() != '') {
      res.render('blog/add_blog', { title: 'Új Cikkek', messages: result.array(), hasErrors: result.array().length > 0 });
    } else {
      let blog = new Blog();
      blog.title = req.body.title;
      blog.author = req.body.author;
      blog.body = req.body.body;
      if (req.body.type)
      blog.type = false;
      blog.save( function(err) {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/');
        }
      });
    }
  });
});




module.exports = router;
