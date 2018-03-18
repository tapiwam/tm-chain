
class Miner {
    constructor(blockchain, transactionPool, wallet, p2pServer){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    /**
     * Mine transaction into a block
     * 1-Grab transactions
     * 2-Create block
     * 3-Sync chain using tp
     * 4-Tell Tp to clear transactions
     */
    mine(){

        const validTransactions = this.transactionPool.validTransactions();

        // include a reward for the miner

        // Create a block consisting of the valid transactions

        // Synchronize chains in the p2p server

        // Clear the transaction pool locally and broadcast to all other transaction pools

    }
}

module.exports = Miner;