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
You can deploy & run web using the compiled hardhat through following commands.
```shell
npx hardhat run scripts/deploy.js --network localhost
npm run dev
```

Compiled solidity codes will be stored in artifacts. You can re-compile solidity codes with following commands. Then, deploy again.
```shell
npx hardhat clean 
npx hardhat compile
```
