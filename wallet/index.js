
const { INITIAL_BALANCE } = require( '../config' );
const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');

class Wallet {
    constructor(){
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString() {
        return `Wallet -
        publicKey: ${this.publicKey}
        balance  : ${this.balance}
        `
    }

    /**
     * Sign data
     * @param dataHash
     */
    sign(dataHash){
        return this.keyPair.sign(dataHash);
    }

    /**
     * Create a transaction that is signed using the wallet's keys
     * @param recipient
     * @param amount
     * @param transactionPool
     * @returns {*}
     */
    createTransaction(recipient, amount, transactionPool){
        if (amount > this.balance) {
            console.log(`Amount: ${amount} exceeds current balance: ${this.balance}`);
            return;
        }

        if (!amount || !recipient ) {
            console.log(`Missing data @amount=${amount} @recipient=${recipient}`);
            return;
        }

        // console.log("CreateTransaction called: @recipient=" + recipient + " @amount=" + amount + " @publicKey=" + JSON.stringify(this.publicKey.substring(0, 10)));

        let transaction = transactionPool.existingTransaction(this.publicKey);

        if(transaction){

            // console.log("Found existing transaction: " + JSON.stringify(transaction));
            transaction.update(this, recipient, amount);

            // console.log("UPDATED: existing transaction: " + JSON.stringify(transaction));
        } else {
            transaction = Transaction.newTransaction(this, recipient, amount);

            // console.log("Created NEW transaction: " + JSON.stringify(transaction));
        }

        transactionPool.updateOrAddTransaction(transaction);

        return transaction;
    }

    /**
     * Default blockchain wallet used to sign reward granted by the blockchain
     * @returns {Wallet}
     */
    static blockchainWallet() {
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-wallet';
        return blockchainWallet;
    }
}

module.exports = Wallet;