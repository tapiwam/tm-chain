const ChainUtil = require('../chain-util');
const { DIFFICULTY, MINE_RATE } = require('../config');

class Block {

    constructor(timestamp, lastHash, hash, data, nonce, difficulty){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }


    /**
     * Return the string representation of the block
     * @returns {string}
     */
    toString(){
        return `Block -
        Timestamp : ${this.timestamp}
        LastHash  : ${this.lastHash.substring(0,10)}
        Hash      : ${this.hash.substring(0,10)}
        Nonce     : ${this.nonce}
        difficulty: ${this.difficulty}
        Data      : ${this.data}`;
    }

    /**
     * Generate the genesis block
     * @returns {Block}
     */
    static genesis (){
        return new this('Genesis time', '-------', 'f1r57-h45h', [], 0, DIFFICULTY);
    }

    /**
     * Mine a block doe some given data.
     * @param lastBlock
     * @param data
     * @returns {Block}
     */
    static mineBlock(lastBlock, data){
        const lastHash = lastBlock.hash;
        let timestamp;
        let nonce = 0;
        let hash;
        let { difficulty } = lastBlock;

        do{
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    /**
     * Generate the hash of a given block
     * @param block
     * @returns {*}
     */
    static blockHash(block) {
        const { timestamp, lastHash, data, nonce, difficulty } = block;
        return Block.hash( timestamp, lastHash, data, nonce, difficulty );
    }

    static hash(timestamp, lastHash, data, nonce, difficulty){
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
    }

    /**
     * Adjust the difficulty to keep the block time withing a certain time range
     * @param lastBlock
     * @param currentTime
     * @returns {*}
     */
    static adjustDifficulty (lastBlock, currentTime){
        let { difficulty } = lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }
}

module.exports = Block;