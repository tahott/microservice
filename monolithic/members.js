const mongoose = require('mongoose');
const Member = require('../models/members.js');

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
    }

    if (params.username == null || params.password == null) {
        response.errorcode = 1;
        response.errormessage = "Invalid Parameter";
        cb(response)
    } else {
        connect().then(
            () => {
                let member = new Member();

                member.username = params.username;
                member.password = member.generateHash(params.password);
                
                member.save( () => {
                    cb(response);
                })
            }
        ).then(
            error => {
                if (error) {
                    response.errorcode = 1;
                    response.errormessage = error;
                }
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
    
    if (params.username == null || params.password == null) {
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        connect().then(
            () => Member.findOne({username:params.username}).exec()
        ).then(
            results => {
                if (results.length == 0) {
                    response.errorcode = 1;
                    response.errormessage = error ? error : "User not found";
                } else if (!results.validPassword(params.password, results._doc.password)) {
                    response.errorcode = 1;
                    response.errormessage = error ? error : "Invalid Password";
                } else {
                    response.userid = results._doc.username;
                }
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

let unregister = (method, pathname, params, cb) => {
    let response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    }

    if (params.username == null) {
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        connect().then(
            () => Member.remove({username:params.useranme}).exec()
        ).then(
            results => {
                console.log(results);
                cb(response);
            }
        ).catch(
            error => {
                response.errorcode = 1;
                response.errormessage = error;
                cb(response);
            }
        )
    }
}