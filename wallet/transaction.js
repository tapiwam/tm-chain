const ChainUtil = require('../chain-util');
const { MINING_REWARD } = require('../config');

class Transaction {

    constructor(){
        this.id = ChainUtil.id();
        this.input = null;
        this.output = [];
    }

    /**
     * Append a new output object to account for sending additional output on the same transaction
     * @param senderWallet
     * @param recipient
     * @param amount
     * @returns {*}
     */
    update(senderWallet, recipient, amount){
        const senderOutput = this.output.find(o => o.address === senderWallet.publicKey);

        if(amount > senderOutput.amount) {
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }


        senderOutput.amount = senderOutput.amount - amount;
        this.output.push( { amount, address: recipient } );
        Transaction.signTransaction(this, senderWallet);

        return this;
    }

    static transactionWithOutputs(senderWallet, outputs){
        const transaction = new this();
        transaction.output.push(...outputs);
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
    }

    /**
     * Create a new transaction
     * @param senderWallet
     * @param recipient
     * @param amount
     * @returns {*}
     */
    static newTransaction(senderWallet, recipient, amount) {

        if(amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }

        return Transaction.transactionWithOutputs(
                senderWallet,
                [
                    {
                        amount: senderWallet.balance - amount,
                        address: senderWallet.publicKey
                    },
                    {
                        amount, // ES6 destruction format
                        address: recipient
                    }
                ]
            );
    }

    static rewardTransaction(minerWallet, blockchainWallet){
        return Transaction.transactionWithOutputs(blockchainWallet, [{
            amount: MINING_REWARD,
            address: minerWallet.publicKey
        }]);
    }

    /**
     * Sign a transaction using the senders private key
     * @param transaction
     * @param senderWallet
     */
    static signTransaction(transaction, senderWallet){
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.output))
        }
    }

    /**
     * Verify a transaction using the senders public key
     * @param transaction
     * @returns {*}
     */
    static verifyTransaction(transaction) {
        return ChainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.output)
        );
    }

}


module.exports = Transaction;