import { useState, useEffect } from 'react'
import Connect_metamask from './components/Connect_metamask';
import Alert_msg from './components/Alert_msg';
import Get_Bid_item from './components/Get_Bid_item';

export default function fetchAuctionItem() {
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
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
      if(contract){
        try {
          let result = await contract.methods.s_highestBidding().call();
          setHighest_bidder(result[0]);
          setHighest_bid(web3.utils.fromWei(result[1], 'ether'));
        } catch(err) {
          console.log(err)
        }
      }else{
        showAlert("Connect to metamask", "danger");
      }
    }

      const place_bid  = async (e) => {
        e.preventDefault();
        if(contract){
              getBidding();
          if(highest_bid>= new_bid){
            showAlert("bid for higher amount than current", "danger");
            setNew_bid('')
          }
          else{
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
              showAlert("place bid error", "danger");
            }
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
    
    <div className="container" style={{ 
              whiteSpace: "nowrap" }}>
      <Alert_msg alertmsg={alertmsg}/>
      <br/>
      <div className="row justify-content-md-center" > 
      <div className="col-6">
      <div className="d-inline-flex align-items-center  w-50 text-white">
          <label htmlFor="metamask connect" className='col-sm-7 col-form-label'>Connect to metamask</label>
         <Connect_metamask showAlert={showAlert}   setWeb3 = {setWeb3Val} 
         setAddressValue={setAddressVal}  setContract = {setContractVal} />
      </div>
      <br/>
      <br/>
      <h4 className="text-white mt-2">
                Check current Highest Bid     
        </h4>
  
        <div className="d-inline-flex align-items-center w-50 mt-3">
          <button type="submit"  onClick={getBidding}  className="btn btn-primary mx-3">Highest Bid</button>
        </div>
        <br/>
            <div className="d-inline-flex align-items-center w-50 mt-3 text-white">
              <label htmlFor="highestBidder" className='col-sm-3 col-form-label bold' >Bidder : </label>
                <output>{highest_bidder} </output>
          </div>
            <br />
            <div className="d-inline-flex align-items-center w-50 mt-3 text-white">
              <label htmlFor="highestBid" className='col-sm-3 col-form-label' >Amount in ETH: </label>
                <output className="mx-5" >{highest_bid} </output>
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
           pattern="[0-9.]+"  min="1" max="10" required/>
      </div>
      <br/>
      <div className="d-inline-flex align-items-center  w-50 text-white mt-3">
        <button type="submit"  onClick={place_bid}  className="btn btn-primary mx-3">Place bid</button>
      </div>
      </form>
      </div>
        <Get_Bid_item  showAlert={showAlert} contract={contract} web3={web3}/> 
    </div>
    </div>
    </div>
    </>
  )
}
