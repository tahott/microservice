const http = require('http');
const url = require('url');
const querystring = require('querystring');
const mongoose = require('mongoose');

const members = require('./monolithic/members.js');
const goods = require('./monolithic/goods.js');
const auctions = require('./monolithic/auctions.js');

// create http server.
let server = http.createServer((req, res) => {
    let method = req.method;
    let uri = url.parse(req.url, true);
    let pathname = uri.pathname;

    if (method === "POST" || method === "PUT") {
        let body = "";

        req.on(`data`, (data) => {
            body += data;
        });

        req.on(`end`, () => {
            let params;

            if (req.headers[`content-type`] == `application/json`) {
                params = JSON.parse(body);
            } else {
                params = querystring.parse(body);
            }

            onRequest(res, method, pathname, params);
        });
    } else {
        onRequest(res, method, pathname, uri.query);
    }
}).listen(3000);

// @params res response 객체
// @params method 메서드
// @params pathname URI
// @params params 입력 파라미터
let onRequest = (res, method, pathname, params) => {
    switch (pathname) {
        case `/members`:
            members.onRequest(res, method, pathname, params, response);
            break;
        case `/goods`:
            goods.onRequest(res, method, pathname, params, response);
            break;
        case `/auctions`:
            auctions.onRequest(res, method, pathname, params, response);
            break;
        default:
            res.writeHead(404);
            return res.end();
    }
};

let response = (res, packet) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(packet));
}