const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');

// Default 3001 port
const HTTP_PORT = process.env.HTTP_PORT || 3001;

// Express application
const app = express();

// Allows us to recieve JSON in POST requests
app.use(bodyParser.json());

// Initialize the blockchain
const bc = new Blockchain();

// Endpoint to get the blockchain
app.get('/blocks', (req, res) => {
    res.json(bc.chain);
});

// Endpoint to mine a new block
app.post('/mine', (req, res) => {
    const block = bc.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);

    res.redirect('/blocks');
});


// Open up the server in given HTTP_PORT
app.listen(HTTP_PORT, ()=> console.log(`Listening on port ${HTTP_PORT}`));