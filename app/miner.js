const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet/index');

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
        validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));

        // Create a block consisting of the valid transactions
        const block = this.blockchain.addBlock(validTransactions);

        console.log("")

        // Synchronize chains in the p2p server
        this.p2pServer.syncChains();

        // Clear the transaction pool locally and broadcast to all other transaction pools
        this.transactionPool.clear();
        this.p2pServer.broadcastClearTransactions();

        return block;
    }
}

module.exports = Miner;