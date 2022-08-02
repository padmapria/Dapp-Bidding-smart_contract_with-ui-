import React from 'react'
import { useState, useEffect } from 'react'
import Connect_metamask from './components/Connect_metamask';
import Alert_msg from './components/Alert_msg';

export default function withdraw() {
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [amount, setAmount] = useState(null)
    const [withdraw_amt, setWithdraw_amt] = useState(null)

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

      const check_bid_amount = async () => {
        if(contract){
          try {
            let result = await contract.methods.s_rejected_bidderToBid(address).call();
            console.log(result)
            if(result==0){
                setAmount(0)
            }
            else{
                setAmount(result)
            }
          } catch(err) {
            console.log(err)
          }
        }else{
          showAlert("Connect to metamask", "danger");
        }
      }

      const withdraw  = async (e) => {
        //https://stackoverflow.com/questions/50193227/basic-react-form-submit-refreshes-entire-page
        e.preventDefault();
        if(amount==0){
          showAlert("No Eth bidded" , "danger");
        }
        else{
          if(contract){
                try {
                  //https://www.youtube.com/watch?v=rXZSnUOhnwc
                  let x = await contract.methods.withdraw().send({
                    from: address, 
                    gas: 3000000,
                    gasPrice: null
                  });
                  let msg = "Withdraw successful"
                  showAlert(msg , "success");
                  if(x==0){
                    msg = "Withdraw unsuccessful"
                    showAlert(msg , "danger");
                  }     
                } catch(err) {
                  console.log(err)
                  showAlert("Withdraw error", "danger");
                }
            } else{
              showAlert("Connect to metamask", "danger");
            }
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
           
        <h4 className="text-white mt-2">
          Check bid amount 
        </h4>
      <br />
         
         <button type="submit"  onClick={check_bid_amount} className="btn btn-primary mx-3">Check Bid amount</button>
         <br/>
         <div className="d-inline-flex align-items-center  w-50 mt-3  text-white" >
         <label htmlFor="amount" className='col-sm-3 col-form-label'>Amount :</label>
             <output> {amount} </output>
         </div>
            <br/>
         <h4 className="text-white mt-2">
          Withdraw unsuccessful bid amount 
        </h4>
            <br />
         
         <button type="submit"  onClick={withdraw} className="btn btn-primary mx-3">Withdraw</button>
      </div>
      </div>
    </div>
    </div>
    </>
  )
}
