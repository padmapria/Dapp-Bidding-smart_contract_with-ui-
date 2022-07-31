import { useState, useEffect } from 'react'
import Eng_Auction from './Eng_Auction';
import Alert_msg from './components/Alert_msg';

export default function fetchAuctionItem() {
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [prod_name, setProd_name] = useState(null)
    const [prod_age, setProd_age] = useState(null)
    const [prod_owner, setProd_owner] = useState(null)
    const [starting_amt, setStarting_amt] = useState(null)
    const [bid_endTime, setBid_endTime] = useState(null)
    const [result_reveal_time, setResult_reveal_time] = useState(null)
    
    const [highest_bidder, setHighest_bidder] = useState(null)
    const [highest_bid, setHighest_bid] = useState(null)
    const [new_bid, setNew_bid] = useState(null)

    useEffect(() => {
      updateState()
    }, [contract])
  
    const updateState = () => {
     // if (contract) getBuyers()
     // if (contract) fetch_auction_item()
    }

    // https://stackoverflow.com/questions/72016466/nextjs-pass-image-as-props-to-be-used-with-next-image
    const [alertmsg, setAlertmsg] = useState(null);
    const showAlert = (message, type)=>{
      setAlertmsg({
        msg: message,
        type: type
      })
      setTimeout(() => {
        setAlertmsg(null);
      }, 2000);
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

    const getBidding = async () => {
      try {
        let result = await contract.methods.s_highestBidding().call();
        setHighest_bidder(result[0]);
        setHighest_bid(web3.utils.fromWei(result[1], 'ether'));
      } catch(err) {
        console.log(err)
      }
    }

    const fetch_auction_item  = async () => {
      if(contract){
        try {
          //https://www.youtube.com/watch?v=rXZSnUOhnwc
          let result  = await contract.methods.s_bidding_item().call();
          console.log(result);
          setProd_name(result[0])
          setProd_age(result[1])
          setProd_owner(result[2])
          setBid_endTime(result[3])
          setResult_reveal_time(result[4])
          setStarting_amt(result[5])
        
        } catch(err) {
          console.log(err)
          alert(err)
          showAlert("Not fetched", "danger");
        }
      }
        else{
          showAlert("Connect to metamask", "danger");
        }
      }

      const place_bid  = async (e) => {
        alert("Going to place a bid")
        e.preventDefault();
        if(contract){
            try {
              //https://www.youtube.com/watch?v=rXZSnUOhnwc
              await contract.methods.placeBid().send({
                from: address, 
                value: web3.utils.toWei(new_bid, 'ether'),
                gas: 3000000,
                gasPrice: null
              });
              var msg = "Successfully bidded ******* "+new_bid;
              showAlert(msg , "success");
              
              if(contract) getBidding();
              setNew_bid('')
            } catch(err) {
              console.log(err)
              showAlert("start Auction error", "danger");
            }
        } 
        }
     
  return (
    <>
    <div className="wrapper" style={{ 
    backgroundImage: `url('/eth_logo.jpg')`,  
    backgroundSize: 'cover',  backgroundRepeat:'no-repeat', height : "100vh" }}>
    
    <div className="container">
      <Alert_msg alertmsg={alertmsg}/>
      <br/>
      <div className="row justify-content-md-center" > 
      <div className="col-6">
      <div className="d-inline-flex align-items-center  w-50 text-white">
          <label htmlFor="metamask connect" className='col-sm-3 col-form-label'>Connect to metamask</label>
         <Eng_Auction showAlert={showAlert}   setWeb3 = {setWeb3Val} 
         setAddressValue={setAddressVal}  setContract = {setContractVal} />
      </div>
      <br/>
      <div className="d-inline-flex align-items-center  w-50 text-white">
      <label htmlFor="highest bid" className='col-sm-3 col-form-label'>Connect to highest bid</label>
      <button type="submit"  onClick={getBidding}  className="btn btn-primary mx-3">Highest Bidder</button>
      </div>
      <br/>
      <div className="d-inline-flex align-items-center w-50 mt-3 text-white">
        <label htmlFor="highestBid" className='col-sm-3 col-form-label' >Highest Bid in ether: </label>
          <output>{highest_bid} </output>
    </div>
      <br/>
      <div className="d-inline-flex align-items-center w-50 mt-3 text-white">
        <label htmlFor="highestBidder" className='col-sm-3 col-form-label' >Bidder : </label>
          <output>{highest_bidder} </output>
    </div>
    <br/>
      
      
      <h3 className="text-white mt-4">
          Place bid (Owner not allowed)
        </h3>
      <br />
      <form className="form-inline">
      <div className="d-inline-flex align-items-center w-50 mt-3 text-white">
          <label htmlFor="new_bid" className='col-sm-3 col-form-label' >Bid value</label>
          <input className="form-control"  type="number"  id="new_bid" 
           value={new_bid} onChange={(e) => setNew_bid(e.target.value)} placeholder="> base price, highest bid" 
           pattern="[0-9.]+"  min="1" max="10"/>
      </div>
      <br/>
      <div className="d-inline-flex align-items-center  w-50 text-white">
      <label htmlFor="new_bid" className='col-sm-3 col-form-label'>Submit new bid</label>
        <button type="submit"  onClick={place_bid}  className="btn btn-primary mx-3">Place bid</button>
      </div>
      </form>
      </div>

      <div className="col" > 
          <button type="submit"  onClick={fetch_auction_item} className="btn btn-primary mx-3">Fetch Auction Item</button>
          <br/>
          <div className="d-inline-flex align-items-center  w-50 mt-3  text-white">
          <label htmlFor="prodName" className='col-sm-3 col-form-label'>Name</label>
              <output> {prod_name} </output>
          </div>
          <br/>
          <div className="d-inline-flex align-items-center w-50 mt-3 text-white">
          <label htmlFor="prodAge" className='col-sm-3 col-form-label' >Age</label>
            <output> {prod_age} </output>
          </div>
          <br/>
          <div className="d-inline-flex align-items-center w-50 mt-3 text-white">
          <label htmlFor="prodOwner" className='col-sm-3 col-form-label' >Owner</label>
              <output> {prod_owner}   </output>
          </div>
          <br/>
          <div className="d-inline-flex align-items-center w-50 mt-3 text-white">
          <label htmlFor="startingAmt" className='col-sm-3 col-form-label' >Starting Price</label>
              <output> {starting_amt}   </output>
          </div>
          <br/>
          
          <div className="d-inline-flex align-items-center w-50 mt-3 text-white">
            <label htmlFor="bidEndTime" className='col-sm-3 col-form-label' >Auction endtime</label>
              <output>{bid_endTime} </output>
        </div>
          <br/>
          <div className="d-inline-flex align-items-center w-50 mt-3 text-white">
            <label htmlFor="resultRevealTime" className='col-sm-3 col-form-label' >Result Reveal Time</label>
              <output>{result_reveal_time} </output>
        </div>
        <br/>
      </div>
    </div>
    </div>
    </div>
    </>
  )
}
