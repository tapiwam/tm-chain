const Block = require('./block');

class Blockchain {

    /**
     * Initialize the block chain with a genesis block
     */
    constructor() {
        this.chain = [Block.genesis()];
    }

    /**
     * Add a new block to the chain
     * @param data
     * @returns {*}
     */
    addBlock(data) {
        const block = Block.mineBlock(this.chain[this.chain.length-1], data);
        this.chain.push(block);

        return block;
    }

    /**
     * Validate a new incoming chain and ensure that the genesis block is correct and that the data inside each block is valid
     * @param chain
     * @returns {boolean}
     */
    isValidChain(chain){

        // Check to make sure that the incoming block has a valid genesis block
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        // Loop through each block of the passed chain and validate
        for(let i=1; i<chain.length; i++){
            const block = chain[i];
            const lastBlock = chain[i-1];

            // Check that the hashes are consistent from block to block. Also check that the data inside each block is valid
            if(block.lastHash !== lastBlock.hash ||
                block.hash !== Block.blockHash(block)
            ){
                return false;
            }
        }

        return true;
    }

    /**
     * Replace the chain only if the length of the chain is longer than the existing chain
     * @param newChain
     */
    replaceChain(newChain){
        if(newChain.length <= this.chain.length){
            console.warn("Received chain is not longer than the current chain.");
            return;
        } else {
            if(!this.isValidChain(newChain)){
                console.error("The received chain is not valid.");
                return;
            }
        }

        console.info("Replacing block chain with the new chain.");
        this.chain = newChain;
    }
}

module.exports = Blockchain;