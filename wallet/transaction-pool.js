const Transaction = require('./transaction');

class TransactionPool {

    constructor() {
        this.transactions = [];
    }

    updateOrAddTransaction(transaction){

        /*if(!Transaction.verifyTransaction(transaction)){
            console.log("Unable to verify transaction.");
            return;
        }*/

        let transactionWithId = this.transactions.find(tran => tran.id === transaction.id );
        if(transactionWithId){
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
        } else {
            this.transactions.push(transaction);
        }
    }

    existingTransaction(address){
        return this.transactions.find(t => t.input.address === address);
    }

}

module.exports = TransactionPool;