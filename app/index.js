const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

// Default 3001 port
const HTTP_PORT = process.env.HTTP_PORT || 3001;

// Express application
const app = express();

// Allows us to receive JSON in POST requests
app.use(bodyParser.json());

// Initialize the blockchain
const bc = new Blockchain();

// User's Wallet
const wallet = new Wallet();

// Transaction pool
const tp = new TransactionPool();

// P2P server to distribute and sync blockchain
const p2pServer = new P2pServer(bc, tp);

// Miner - Give ability to officially add transactions to the Blockchain
const miner = new Miner(bc, tp, wallet, p2pServer);

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


app.post('/transact', (req, res) => {
    const { recipient, amount } = req.body;
    const transaction = wallet.createTransaction(recipient, amount, tp);

    p2pServer.broadcastTransaction(transaction);

    // console.log("Added transaction: " + JSON.stringify(transaction));

    res.redirect('/transactions');
});

app.post('/mine-transactions', (req, res) => {
    const block =  miner.mine();
    console.log(`A new block has been added: ${block.toString()}` );
    res.redirect('/blocks');
});


app.get('/public-key', (req, res) => {
    res.json({ publicKey : wallet.publicKey});
});


// Open up the server in given HTTP_PORT
app.listen(HTTP_PORT, ()=> console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();