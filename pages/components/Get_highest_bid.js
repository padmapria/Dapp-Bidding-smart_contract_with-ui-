import React from 'react'
import { useState, useEffect } from 'react'

export default function Get_highest_bid(props) {
  const [highest_bidder, setHighest_bidder] = useState(null)
  const [highest_bid, setHighest_bid] = useState(null)
    const getHighestBidding = async (e) => {
      alert("Checking highest bid")
        e.preventDefault();
        if(props.contract){
          try {
            let result = await props.contract.methods.s_highestBidding().call();
            setHighest_bid(props.web3.utils.fromWei(result[1], 'ether'));
            setHighest_bidder(result[0])
            console.log(result)
          } catch(err) {
            console.log(err)
          }
        }else{
            props.showAlert("Connect to metamask", "danger");
        }
      }
  
  return (
    <div>
        <h4 className="text-white mt-2">
                Check current Highest Bid     
        </h4>
  
        <div className="d-inline-flex align-items-center w-50 mt-3">
          <button type="submit"  onClick={getHighestBidding}  className="btn btn-primary mx-3">Highest Bid</button>
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
    </div>
  )
}
