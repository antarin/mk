const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');

let userSchema = new Schema({
  name: {type: String, required: true},
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  create_date: { type: Date, default: Date.now },
  last_login: { type: Date, default: Date.now },
  online: { type: Boolean, default: false },
  persmissions: {
    admin: {type: Boolean, default: false},
    delete_user: {type: Boolean, default: false},
    add_blog: {type: Boolean, default: false},
    remove_blog: {type: Boolean, default: false},
    hide_comments: {type: Boolean, default: false}
  }
});

userSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
