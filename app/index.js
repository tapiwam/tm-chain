const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');

// Default 3001 port
const HTTP_PORT = process.env.HTTP_PORT || 3001;

// Express application
const app = express();

// Allows us to recieve JSON in POST requests
app.use(bodyParser.json());

// Initialize the blockchain
const bc = new Blockchain();

// User's Wallet
const wallet = new Wallet();

// Transaction pool
const tp = new TransactionPool();

// P2P server to distribute and sync blockchain
const p2pServer = new P2pServer(bc);

// Endpoint to get the blockchain
app.get('/blocks', (req, res) => {
    res.json(bc.chain);
});

// Endpoint to mine a new block
app.post('/mine', (req, res) => {
    const block = bc.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);

    p2pServer.syncChains();

    res.redirect('/blocks');
});

// Endpoint to get transactions from the transaction pool
app.get('/transactions', (req, res) => {
    res.json(tp.transactions);
});

// Open up the server in given HTTP_PORT
app.listen(HTTP_PORT, ()=> console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();