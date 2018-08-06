const mongoose = require('mongoose');
// members 모델 추가 필요.

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
                let members = new Members();

                members.username = params.username;
                members.password = params.password; // 암호화 해야함
                
                members.save( () => {
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
            () => Members.findOne({_id:params.id, password:params.password}).exec()
        ).then(
            results => {
                if (results.length == 0) {
                    response.errorcode = 1;
                    response.errormessage = error ? error : "Invalid Password";
                } else {
                    response.userid = results[0]._id;
                }
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
            () => Members.remove({_id:params.useranme}).exec()
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