# tm-chain
This is a simple blockchain implementation written in NodeJS.

###Usage
- Clone repo
- Install dependencies using npm
```bash
$ npm install
```
- To run test nodes
```bash
$ npm run dev
```
- For a additional nodes to test peer-to-peer testing you can specify the HTTP, P2P ports and P2P_PEERS to run and connect to.
```bash
$ HTTP_PORT=3002 P2P_PORT=5002 P2P_PEERS=ws://localhost:5001 npm run dev
```
- And another node
```
$ HTTP_PORT=3003 P2P_PORT=5003 P2P_PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev
```