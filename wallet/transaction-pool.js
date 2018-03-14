const Transaction = require('./transaction');

class TransactionPool {

    constructor() {
        this.transactions = [];
    }

    updateOrAddTransaction(transaction){

        if(!Transaction.verifyTransaction(transaction)){
            console.log("Unable to verify transaction.");
            return;
        }

        /*let existingTransaction = this.transactions.find(tran => tran.id === transaction.id );

        if(existingTransaction){

        }*/
    }

}

module.exports = TransactionPool;