import { useState, useEffect } from 'react'
import Eng_Auction from './Eng_Auction';
import Alert_msg from './components/Alert_msg';

export default function addAuctionItem() {
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [prod_name, setProd_name] = useState(null)
    const [prod_age, setProd_age] = useState(null)
    const [starting_price, setStarting_price] = useState(null)
    const [auction_time, setAuction_time] = useState(null)

    // https://stackoverflow.com/questions/72016466/nextjs-pass-image-as-props-to-be-used-with-next-image
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

    const fetch_auction_item  = async () => {
      alert(" Going to fetch stored result")
        try {
          //https://www.youtube.com/watch?v=rXZSnUOhnwc
          let result  = await contract.methods.s_bidding_item().call();
          console.log("**********")
          console.log(result)
        }catch(err) {
          console.log(err)
          showAlert(alertmsg, "danger");
        }
    }
    const start_auction  = async (e) => {
      //https://stackoverflow.com/questions/50193227/basic-react-form-submit-refreshes-entire-page
      e.preventDefault();
      if(contract){
        alert('inside web3')
          try {
            //https://www.youtube.com/watch?v=rXZSnUOhnwc
            await contract.methods.create_auction_item(prod_name,
            prod_age, starting_price, auction_time ).send({
              from: address, 
              gas: 3000000,
              gasPrice: null
            });
            var msg = "Successfully added bid item ******* "+prod_name;
            showAlert(msg , "success");
            setProd_age('')
            setProd_name('')
            setStarting_price('')
            setAuction_time('')            
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
      <div className="mt-5"> 
        <h3 className="text-white">
          Add item to bid (only owner)
        </h3>
      <br />
     
      <div className="d-inline-flex align-items-center  w-50 text-white">
          <label htmlFor="metamask connect" className='col-sm-3 col-form-label'>Connect to metamask</label>
         <Eng_Auction showAlert={showAlert}   setWeb3 = {setWeb3Val} 
         setAddressValue={setAddressVal}  setContract = {setContractVal} />
      </div>
      <br/>
      <form className="form-inline">
      <div className="d-inline-flex align-items-center  w-50 mt-3  text-white">
          <label htmlFor="prod_name" className='col-sm-3 col-form-label'>Product Name</label>
          <input className="form-control"  type="text"  id="prod_name" value={prod_name}  placeholder="product name" pattern="^[a-zA-Z]+$" 
          onChange={(e) => setProd_name(e.target.value)}/>
      </div>
      <br/>
      <div className="d-inline-flex align-items-center w-50 mt-3 text-white">
          <label htmlFor="age" className='col-sm-3 col-form-label' >Product Age</label>
          <input className="form-control"  type="number"  id="prod_age" 
           value={prod_age} onChange={(e) => setProd_age(e.target.value)} placeholder="produt Age" 
           pattern="[0-9.]+"  min="1" max="10"/>
      </div>
      <br/>
      <div className="d-inline-flex align-items-center w-50 mt-3 text-white">
          <label htmlFor="amount"  className='col-sm-3 col-form-label'>Starting Price</label>
          <input className="form-control" type="number"  id="starting_price"  value={starting_price}  onChange={(e) => setStarting_price(e.target.value)}  placeholder="Starting Bid amount" 
           pattern="[0-9.]+" />
      </div>
      <br/>
      
      <div className="d-inline-flex align-items-center w-50 mt-3 text-white">
          <label htmlFor="auctionTime" className='col-sm-3 col-form-label' >Auction duration</label>
          <input className="form-control" type="number"  id="auction_time" placeholder="Auction time in mins" 
           value={auction_time} onChange={(e) => setAuction_time(e.target.value)} 
           pattern="[0-9.]+"  min="10" max="30"/>
    </div>
      <br/>
      <div className="mt-2">
          <input type="checkbox" className="form-check-input mt-3 mx-2" id="exampleCheck1" />
          <label className="form-check-label text-white mt-3" htmlFor="exampleCheck1">The details above are true</label>
      </div>
      <br/>
      <button type="submit"  onClick={start_auction}  className="btn btn-primary mx-3">Start Auction</button>
      </form>
      <br/>
      </div>
    </div>
    </div>
    </>
  )
}
