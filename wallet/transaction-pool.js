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

    /**
     * 1-Total output amount matches input amount in
     * 2-Verify signature of every transaction
     */
    validTransactions(){
        return this.transactions.filter( transaction => {
            const outputTotal = transaction.output.reduce((total, output) => {
                return total + output.amount;
            }, 0);

            if(transaction.input.amount !== outputTotal){
                console.log(`Invalid transaction amount from @expectedAmount=${transaction.input.amount} @actual=${outputTotal} @address=${transaction.input.address}`);
                return;
            }

            if(!Transaction.verifyTransaction(transaction)){
                console.log(`Invalid signature from @expected=${transaction.input.signature} @address=${transaction.input.address}`);
                return;
            }

            return transaction;
        })
    }

    clear(){
        this.transactions = [];
    }
}

module.exports = TransactionPool;