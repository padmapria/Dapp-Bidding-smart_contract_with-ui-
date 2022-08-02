import React from 'react'
import { useState, useEffect } from 'react'
import Connect_metamask from './components/Connect_metamask';
import Alert_msg from './components/Alert_msg';
import Get_highest_bid from './components/Get_highest_bid';

export default function withdraw() {
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [amount, setAmount] = useState(null)
   

    const [alertmsg, setAlertmsg] = useState(null);
    const showAlert = (message, type)=>{
      setAlertmsg({
        msg: message,
        type: type
      })
      setTimeout(() => {
        setAlertmsg(null);
      }, 5000);
    }

    const setAddressVal = (value)=>{
        setAddress(value);
      }
  
      const setContractVal = (value)=>{
        setContract(value);
      }
  
      const setWeb3Val = (value)=>{
        setWeb3(value);
      }
      const setHighest_bid_val = (value)=>{
        console.log(value)
        setHighest_bid(value);
      }

      const setHighest_bidder_val = (value)=>{
        console.log(value)
        setHighest_bidder(value);
      }

      const close_bidding  = async (e) => {
        //https://stackoverflow.com/questions/50193227/basic-react-form-submit-refreshes-entire-page
        e.preventDefault();
          if(contract){
                try {
                  //https://www.youtube.com/watch?v=rXZSnUOhnwc
                  let x = await contract.methods.auctionEnd().send({
                    from: address, 
                    gas: 3000000,
                    gasPrice: null
                  });
                  let msg = "Transfer to unsuccessful bidders successful"
                  showAlert(msg , "success");   
                } catch(err) {
                  console.log(err)
                  showAlert("Transfer to unsuccessful bidders error", "danger");
                }
            } else{
              showAlert("Connect to metamask", "danger");
        }
      }

      const transfer_amt_to_owner  = async (e) => {
        //https://stackoverflow.com/questions/50193227/basic-react-form-submit-refreshes-entire-page
        e.preventDefault();
          if(contract){
                try {
                  //https://www.youtube.com/watch?v=rXZSnUOhnwc
                  let x = await contract.methods.reveal_aution_results().send({
                    from: address, 
                    gas: 3000000,
                    gasPrice: null
                  });
                  let msg = "Transfer successful"
                  showAlert(msg , "success");
                } catch(err) {
                  console.log(err)
                  showAlert("Transfer error", "danger");
                }
            } else{
              showAlert("Connect to metamask", "danger");
            }
        
      }

  return (
    <>
    <div className="wrapper" style={{ 
    backgroundImage: `url('/eth_logo.jpg')`,  
    backgroundSize: 'cover',  backgroundRepeat:'no-repeat', height : "100vh" }}>
    
    <div className="container" style={{ 
              whiteSpace: "nowrap" }}>
      <Alert_msg alertmsg={alertmsg}/>
      <br/>
      <div className="row justify-content-md-center" > 
      <div className="col">
      <div className="d-inline-flex align-items-center text-white">
          <label htmlFor="metamask connect" className='col-sm-7 col-form-label'>Connect to metamask</label>
         <Connect_metamask showAlert={showAlert}   setWeb3 = {setWeb3Val} 
         setAddressValue={setAddressVal}  setContract = {setContractVal} />
      </div>
        <br />
        <br />

        <h3 className='text-white'>
          Only allowed after the bid end time
        </h3>
         
      <div className="d-inline-flex align-items-center text-white">
          <label htmlFor="metamask connect" className='col-sm-7 col-form-label '>Close bidding/ Return unsuccessful bidders</label>
          <button type="submit"  onClick={close_bidding} className="btn btn-primary mx-5">Close Bidding</button>
      </div>
        <br />
        <br />
        <div className="d-inline-flex align-items-center text-white">
          <label htmlFor="metamask connect" className='col-sm-7 col-form-label'>Transfer bid amount to owner</label>
         <button type="submit"  onClick={transfer_amt_to_owner} className="btn btn-primary mx-5">Transfer</button>
        </div>
         
      </div>
      <div className="col">
            <Get_highest_bid showAlert={showAlert} contract={contract} web3={web3}  />
      </div>
      </div>
    </div>
    </div>
    </>
  )
}
