'use strict';

const business = require('../monolithic/goods.js');
class goods extends require('../server.js') {
    constructor() {
        super("goods"
            , process.argv[2] ? Number(process.argv[2]) : 9010
            , ["POST/goods", "GET/goods", "DELETE/goods"]
        );

        this.connectToDistributor("localhost", 9000, (data) => {
            console.log("Distributor Notification", data);
        });
    }

    onRead(socket, data) {
        console.log("onRead", socket.remoteAddress, socket.remotePort, data);
        business.onRequest(socket, data.method, data.uri, data.params, (s, packet) => {
            socket.write(JSON.stringify(packet) + '¶');
        })
    }
}

new goods();