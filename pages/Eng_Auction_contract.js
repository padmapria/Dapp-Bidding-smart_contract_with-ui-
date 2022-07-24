import English_Auction from "../artifacts/contracts/English_Auction.sol/English_Auction.json";

import Web3 from 'web3'
import * as contract_end_point from '../contract_deployed_endpoint';


const contract = web3 => {
     return new web3.eth.Contract(English_Auction.abi, contract_end_point.english_Auction_contract_Addr);
}

console.log(contract)

export {contract}