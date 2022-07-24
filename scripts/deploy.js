// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const English_Auction = await hre.ethers.getContractFactory("English_Auction");
  const english_Auction = await English_Auction.deploy();
  await english_Auction.deployed();
  console.log("english_Auction deployed to:", english_Auction.address);

 fs.writeFileSync('./contract_deployed_endpoint.js', `
  export const english_Auction_contract_Addr = "${english_Auction.address}"
  export const english_Auction_owner_Addr = "${english_Auction.signer.address}"
  `)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
