const mongoose = require('mongoose');
const Goods = require('../models/goods');

const connect = () => {
    return mongoose.connect('mongodb://localhost:27017/monolithic')
}

exports.onRequest = (res, method, pathname, params, cb) => {
    switch (method) {
        case `POST`:
            return register(method, pathname, params, (response) => {
                process.nextTick(cb, res, response);
            });
        case `GET`:
            return inquiry(method, pathname, params, (response) => {
                process.nextTick(cb, res, response);
            });
        case `DELETE`:
            return unregister(method, pathname, params, (response) => {
                process.nextTick(cb, res, response);
            });
        default:
            return process.nextTick(cb, res, null);
    }
}

let register = (method, pathname, params, cb) => {
    let response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };

    if (params.name == null || params.category == null || params.price == null || params.description == null) {
        response.errorcode = 1;
        response.errormessage = "Invalid Parameter";
        cb(response);
    } else {
        connect().then(
            () => Goods.find({}).exec()
        ).then(
            results => {
                console.log(results);
                if (results == null) {
                    let goods = new Goods();
                    goods._id = 1;
                    goods.name = params.name;
                    goods.category = params.category;
                    goods.price = params.price;
                    goods.description = params.description;

                    goods.save( () => {
                        cb(response)
                    })
                } else {
                    let goods = new Goods();
                    goods._id = results[results.length-1]._id + 1;
                    goods.name = params.name;
                    goods.category = params.category;
                    goods.price = params.price;
                    goods.description = params.description;

                    goods.save( () => {
                        cb(response)
                    })
                }
            }
        ).catch(
            error => {
                response.errorcode = 1;
                response.errormessage = error.message;
                cb(response);
            }
        )
    }
}

let inquiry = (method, pathname, params, cb) => {
    let response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    }

    connect().then(
        () => Goods.find({}).exec()
    ).then(
        results => {
            if (results.length == 0) {
                response.errorcode = 1;
                response.errormessage = "no data";
            } else {
                response.results = results;
            }
            cb(response);
        }
    ).catch(
        error => {
            response.errorcode = 1;
            response.errormessage = error.message ? error : "no data";
            cb(response);
        }
    )
}

let unregister = (method, pathname, params, cb) => {
    let response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    }

    if (params.id == null) {
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        connect().then(
            () => Goods.remove({_id: params.id}).exec()
        ).then(
            results => {
                console.log(results);
                cb(response);
            }
        ).catch(
            error => {
                response.errorcode = 1;
                response.errormessage = error.message;
                cb(response);
            }
        )
    }
}