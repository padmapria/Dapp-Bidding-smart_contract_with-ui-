import Head from 'next/head'
import { useState, useEffect } from 'react';

// import English_Auction from "../artifacts/contracts/English_Auction.sol/English_Auction.json";
// import * as contract_end_point from '../contract_deployed_endpoint';
import Web3 from 'web3'
import {Eng_contract} from './components/Eng_Auction_contract.js';

//way1 to import from parent
//export default function Eng_Auction({showAlert} ) {

//way2
export default function Eng_Auction(props) {
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)

    const connectToMetamask = async () => {
        /* To check if metamask is installed */
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
              /* request wallet connect */
              await window.ethereum.request({ method: "eth_requestAccounts" })
              /* create web3 instance and set to state var */
              const web3 = new Web3(window.ethereum)
              /* set web3 instance */
              setWeb3(web3)
              /* get list of accounts */
              const accounts = await web3.eth.getAccounts()
              /* set Account 1 to React state var */
              setAddress(accounts[0])
              console.log("Accounts 0",+accounts[0])
              
              const cont = Eng_contract(web3)
              setContract(cont);
             
              props.setWeb3(web3);
              props.setAddressValue(accounts[0]);
              props.setContract(cont);
              var alertmsg = "connected to "+accounts[0]
              //way1
              //showAlert(alertmsg, "success");

              //way2
               props.showAlert(alertmsg, "success");
            } catch(err) {
               props.showAlert("Failed to connect", "danger");
            }
        } else {
            // meta mask is not installed use ganache
            console.log("install MetaMask use ganache instead")
        }
      }

  return (
    <>
    <div>
    </div>
    <div>
    <form className="form-inline">
      <button type="button" className="btn btn-warning" id="metamask connect" onClick={connectToMetamask}>Click to connect </button>
      <input type="hidden" value={address} />
      </form>
    </div>
    </>
  )
}
