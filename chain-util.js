
const EC = require('elliptic').ec;
const uuidV1 = require('uuid/v1');
const SHA256 = require('crypto-js/sha256');

const ec = new EC('secp256k1');

class ChainUtil {

    /**
     * Generate a key value pair
     * @returns {*}
     */
    static genKeyPair(){
        return ec.genKeyPair();
    }

    /**
     * Generate a UUID
     * @returns {*}
     */
    static id(){
        return uuidV1();
    }

    /**
     * Calculate the hash given passed parameters
     * @param data
     */
    static hash(data){
        return SHA256(JSON.stringify(data)).toString();
    }

    static verifySignature(publicKey, signature, dataHash){
        return ec.keyFromPublic(publicKey, 'hex')
            .verify(dataHash, signature);
    }


}

module.exports = ChainUtil;