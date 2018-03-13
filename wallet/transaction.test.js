const Transaction = require('./transaction');
const Wallet = require('./index');

describe('Transaction', () => {

    let transaction, wallet, recipient, amount;

    beforeEach(() => {
       wallet = new Wallet();
       amount = 50;
       recipient = 'r3c1p13nt';

       transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it('outputs the `amount` subtracted from the wallet balance', () => {
        expect(transaction.output.find(o => o.address === wallet.publicKey).amount)
            .toEqual(wallet.balance - amount);
    });

    it('outputs the `amount` added to the recipient', () => {
        expect(transaction.output.find(o => o.address === recipient).amount)
            .toEqual(amount);
    });

    it('inputs the balance of the wallet', () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    })

    describe('transaction where the amount exceeds the balance', () => {
        beforeEach( () => {
            amount = 50000;
            transaction = Transaction.newTransaction(wallet, recipient, amount);
        });

        it('does not create the transaction', () => {
            expect(transaction).toEqual(undefined);
        });
    });

});