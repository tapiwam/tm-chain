const BlockChain = require("./blockchain");

const bc = new BlockChain();

for(let i=0; i<10; i++){
    console.log(bc.addBlock(`foo ${i}`.toString()));
}

