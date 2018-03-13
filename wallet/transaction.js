const ChainUtil = require('../chain-util');


class Transaction {

    constructor(){
        this.id = ChainUtil.id();
        this.input = null;
        this.output = [];
    }

    static newTransaction(senderWallet, recipient, amount) {
        const transaction = new this();

        if(amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }

        transaction.output.push(...[
            {
                amount: senderWallet.balance - amount,
                address: senderWallet.publicKey
            },
            {
                amount, // ES6 destruction format
                address: recipient
            }
        ]);

        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
    }

    static signTransaction(transaction, senderWallet){
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.output))
        }
    }

}


module.exports = Transaction;