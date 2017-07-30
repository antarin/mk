const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const moment = require('moment');

moment.locale('hu')


/* GET home page. */
router.get('/', function(req, res, next) {
  Blog.find({}, function(err, cikkek) {
    let blogChunks = [];
    let chunkSize = 4;
    for (let i = 0; i < cikkek.length; i++) {
      cikkek[i].body = cikkek[i].body.slice(0, 450) + '...';
      cikkek[i].date2 = moment(cikkek[i].date).format('LL');
    }
    for (let i = 0; i < cikkek.length; i += chunkSize) {
      blogChunks.push(cikkek.slice(i, i + chunkSize));
    }
    res.render('index', {title: 'MK főoldal', cikkek: blogChunks});
  });
});

router.get('/blog/:id', function(req, res, next) {
  let blogId = req.params.id;
  Blog.findById(blogId, function(err, blog) {
    blog.date2 = moment(blog.date).format('LL');
    res.render('blog/single', {blog: blog});
  if (err) {
    console.log(err);
    res.redirect('/');
  }
  });
});

module.exports = router;
