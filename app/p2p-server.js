
const Websocket = require('ws');

// Default websocket port of 5001
const P2P_PORT = process.env.P2P_PORT || 5001;

// Check is peers env variable present and split. In not set to empty array
const peers = process.env.P2P_PEERS ? process.env.P2P_PEERS.split(',') : [];

// HTTP_PORT=3002 P2P_PORT=5002 P2P_PEERS=ws://localhost:5001 npm run dev
// HTTP_PORT=3003 P2P_PORT=5003 P2P_PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev

class P2pServer {
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.sockets = [];
    }

    listen() {
        const server = new Websocket.Server({port: P2P_PORT});

        server.on('connection', socket => this.connectSocket(socket));

        this.connectToPeers();

        console.log(`Listening for peer-to-peer connections on port ${P2P_PORT}`);
    }

    connectToPeers(){
        peers.forEach(peer => {
            // ws://localhost:5001

            const socket = new Websocket(peer);

            socket.on('open', () => this.connectSocket(socket));
        })
    }

    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('Socket connected');

        // Attache message handler. i.e. so we can send and receive data
        this.messageHandler(socket);

        // Send our blockchain
        this.sendChain(socket);
    }

    messageHandler(socket){
        socket.on('message', message => {
            const data = JSON.parse(message);
            // console.log('data', data.length);
            this.blockchain.replaceChain(data);
        });
    }

    sendChain(socket){
        socket.send(JSON.stringify(this.blockchain.chain));
    };


    syncChains(){
        this.sockets.forEach(socket => {
            this.sendChain(socket);
        })
    }

}

module.exports = P2pServer;