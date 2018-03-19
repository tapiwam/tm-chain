const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain');
const { INITIAL_BALANCE } = require('../config');

describe('Wallet', () => {

    let wallet, tp, bc;

    beforeEach(() => {
        wallet = new Wallet();
        bc = new Blockchain();
        tp = new TransactionPool();
    });

    describe('creating a transaction', () =>{
        let transaction , sendAmount, recipient;

        beforeEach(() => {
            sendAmount = 50;
            recipient = 'r4and0m-4ddr355';
            transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
        });

        describe('and doing the same transaction', () => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, bc, tp);
            });

            it('doubles the `sendAmount` subtracted from the wallet balance', () => {
                expect(transaction.output.find(o => o.address === wallet.publicKey).amount)
                    .toEqual(wallet.balance - (sendAmount *2));
            });

            it('clones the `sendAmount` output for the recipient', () => {
                expect(transaction.output.filter(o => o.address === recipient)
                    .map(o => o.amount)
                ).toEqual([sendAmount, sendAmount]);
            })
        })
    });

    describe('calculating a balance', () => {
       let addBalance, repeatAdd, senderWallet;

       beforeEach(() => {
           senderWallet = new Wallet();
           addBalance = 100;
           repeatAdd = 3;

           for(let i=0; i<repeatAdd; i++){
               senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
           }

           bc.addBlock(tp.transactions);
       });

       it('calculates the balance for blockchain transactions matching the recipient', () => {
            expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + (addBalance * repeatAdd));
       });

       it('calculated the balance for the blockchain transactions matching the sender', () => {
           expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - (addBalance * repeatAdd));
       });

       describe('and recipient conducts a transaction', () =>{
            let subtractBalance, recipientBalance;

            beforeEach(() => {
               tp.clear();
               subtractBalance = 60;
               recipientBalance = wallet.calculateBalance(bc);

               // create new trans
               wallet.createTransaction(senderWallet.publicKey, subtractBalance, bc, tp);
               bc.addBlock(tp.transactions);
            });

            describe('and sender sends another transaction to recipient', () => {
                beforeEach(() => {
                    tp.clear();
                    senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
                    bc.addBlock(tp.transactions);
                });

                it('calculates the recipient balance only using transaction since the most recent one', () => {
                    expect(wallet.calculateBalance(bc)).toEqual(recipientBalance - subtractBalance + addBalance);
                });
            })
       })
    });

})

