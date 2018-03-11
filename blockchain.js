const Block = require('./block');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock(data) {
        const block = Block.mineBlock(this.chain[this.chain.length-1], data);
        this.chain.push(block);

        return block;
    }

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

            return true;
        }

    }
}

module.exports = Blockchain;