const mongoose = require('mongoose');

const goodsSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    category: String,
    startprice: Number,
    auction: [{
        userid: Number,
        price: Number
    }],
    closetime: Date,
    state: {type: Boolean, default: true},
    description: String
})

module.exports = mongoose.model('Goods', goodsSchema);