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
        setHighest_bid(result[1])
      } catch(err) {
        console.log(err)
      }
    }

    const fetch_auction_item  = async () => {
      if(contract){
        alert(" Going to get auction item")
        try {
          //https://www.youtube.com/watch?v=rXZSnUOhnwc
          let result  = await contract.methods.s_bidding_item().call();
          console.log("**********");
          console.log(result);
          console.log(result[0]);
          setProd_name(result[0].replace(/^(0x)0+((\w{4})+)$/, "$1$2"))
          setProd_age(result[1])
          setProd_owner(result[2])
          setStarting_amt(result[3])
          setBid_endTime(result[4])
          setResult_reveal_time(result[5])
        
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
        <label htmlFor="highestBid" className='col-sm-3 col-form-label' >Highest Bid : </label>
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