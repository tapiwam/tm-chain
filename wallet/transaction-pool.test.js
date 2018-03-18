
const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');

describe('TransactionPool', () => {

    let tp, wallet, transaction, recipient;

    beforeEach(() => {
        tp = new TransactionPool();
        wallet = new Wallet();

        transaction = Transaction.newTransaction(wallet, 'r3c1p13nt1', 30);
        tp.updateOrAddTransaction(transaction);
    });

    it('adds a transaction to the transaction pool', () => {
        expect(tp.transactions.find(t => t.id == transaction.id)).toEqual(transaction);
    });

    it('updates a transaction in the pool', () => {
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet, 'foo-4ddr355', 40);
        tp.updateOrAddTransaction(newTransaction);

        expect(JSON.stringify(tp.transactions.find( t => t.id === newTransaction.id)))
            .not.toEqual(oldTransaction);
    });

});