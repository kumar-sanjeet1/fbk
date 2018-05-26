const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
  username: { type: String, unique: true },
  fullname: { type: String, unique: true, default: '' },
  email: { type: String, unique: true },
  password: { type: String, default: '' },
  userImage: { type: String, default: 'default.png' },
  facebook: { type: String, default: '' },
  fbToken: Array,
  google: { type: String, default: '' },
  googleToken: Array
});

userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

userSchema.methods.validUserpassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);
