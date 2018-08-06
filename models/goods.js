const mongoose = require('mongoose');

const goodsSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    category: String,
    price: Number,
    description: String
})

module.exports = mongoose.model('Goods', goodsSchema);