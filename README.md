# Simple Personal Collectibles Mangagement System based on Blockchain

First install required libraries + metamask.

```shell
npm install
```
This project uses hardhat development environment so you can compile & deploy using npx hardhat.
To run project...
```shell
npx hardhat compile
npx hardhat node
```
Note that you have to keep ```npx hardhat node``` terminal to keep network.
You can deploy the smart contract using the compiled hardhat through following commands.
```shell
npx hardhat run scripts/deploy.js --network localhost
```
The above command will give you address to your two deployed smart contracts.
You can change the addresses in config file with the ones from above command.

Finally you can run a web using the following.
``` shell
npm run dev
```

Compiled solidity codes will be stored in artifacts. You can re-compile solidity codes with following commands. Then, deploy again.
```shell
npx hardhat clean 
npx hardhat compile
```
