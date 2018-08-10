const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const memberSchema = new mongoose.Schema({
    _id: Number,
    username: String,
    password: String
});

memberSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

memberSchema.methods.validPassword = (password, pwd) => {
    return bcrypt.compareSync(password, pwd);
};

module.exports = mongoose.model('Member', memberSchema);