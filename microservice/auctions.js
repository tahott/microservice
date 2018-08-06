'use strict';

const business = require('../monolithic/auctions.js');
class auctions extends require('../server.js') {
    constructor() {
        super("auctions"
            , process.argv[2] ? Number(process.argv[2]) : 9030
            , ["POST/auctions", "GET/auctions"]
        );

        this.connectToDistributor("localhost", 9000, (data) => {
            console.log("Distributor Notification", data);
        });
    }

    onRead(socket, data) {
        console.log("onRead", socket.remoteAddress, socket.remotePort, data);
        business.onRequest(socket, data.method, data.uri, data.params, (s, packet) => {
            socket.write(JSON.stringify(packet) + '¶');
        });
    }
}

new auctions();