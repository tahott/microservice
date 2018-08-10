const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    _id: Number,
    userid: Number,
    goodsid: Number,
    date: Date.now()
})

module.exports = mongoose.model('auctions', auctionSchema);