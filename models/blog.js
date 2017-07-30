const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title:  { type: String, required: true, unique: true },
  author: { type: String, required: true },
  body:  { type: String, required: true },
  comments: [{ body: String, date: Date, user: String }],
  date: { type: Date, default: Date.now },
  hidden: { type: Boolean, default: false },
  type: { type: Boolean, default: true },
  meta: {
    like: { type: Number, default: 0 },
    dislike: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('Blog', blogSchema);
