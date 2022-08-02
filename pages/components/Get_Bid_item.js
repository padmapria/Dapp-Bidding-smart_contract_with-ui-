import React from 'react'
import { useState, useEffect } from 'react';

export default function Get_Bid_item(props) {
    const [prod_name, setProd_name] = useState(null)
    const [prod_age, setProd_age] = useState(null)
    const [prod_owner, setProd_owner] = useState(null)
    const [starting_amt, setStarting_amt] = useState(null)
    const [bid_endTime, setBid_endTime] = useState(null)
    const [result_reveal_time, setResult_reveal_time] = useState(null)

    const fetch_auction_item  = async () => {
        if(props.contract){
          try {
            //https://www.youtube.com/watch?v=rXZSnUOhnwc
            let result  = await props.contract.methods.s_bidding_item().call();
            console.log(result);
            setProd_name(props.web3.utils.hexToString(result[0]))
            setProd_age(result[1])
            setProd_owner(result[2])
           
            //https://www.w3schools.com/jsref/jsref_tolocalestring.asp
            let myDate = new Date(result[3]*1000);
            console.log(myDate.toLocaleString()); // 01/10/2020, 10:35:02
            setBid_endTime(myDate.toLocaleString("en-IN"))

            myDate = new Date(result[4]*1000);
            setResult_reveal_time(myDate.toLocaleString("en-IN"))
            setStarting_amt(result[5])
          
          } catch(err) {
            console.log(err)
            alert(err)
            props.showAlert("Not fetched", "danger");
          }
        }
          else{
            props.showAlert("Connect to metamask", "danger");
          }
        }
  return (
    <>
        <div className="col" > 
        <h4 className="text-white mt-2">
          Check bid item 
        </h4>
      <br />
         
         <button type="submit"  onClick={fetch_auction_item} className="btn btn-primary mx-3">Fetch Auction Item</button>
         <br/>
         <div className="d-inline-flex align-items-center  w-50 mt-3  text-white" >
         <label htmlFor="prodName" className='col-sm-3 col-form-label'>Name</label>
             <output> {prod_name} </output>
         </div>
         <br/>
         <div className="d-inline-flex align-items-center w-50 mt-3 text-white" >
         <label htmlFor="prodAge" className='col-sm-3 col-form-label' > Age : </label>
           <output> {prod_age} </output>
         </div>
         <br/>
         <div className="d-inline-flex align-items-center w-50 mt-3 text-white" >
         <label htmlFor="prodOwner" className='col-sm-3 col-form-label' >Owner :</label>
             <output> {prod_owner}   </output>
         </div>
         <br/>
         <div className="d-inline-flex align-items-center w-50 mt-3 text-white" >
         <label htmlFor="startingAmt" className='col-sm-3 col-form-label' >Starting Price : </label>
             <output className="mx-5"> {starting_amt}   </output>
         </div>
         <br/>
         
         <div className="d-inline-flex align-items-center w-50 mt-3 text-white" >
           <label htmlFor="bidEndTime" className='col-sm-3 col-form-label' >Auction endtime :</label>
             <output className="mx-5">{bid_endTime} </output>
       </div>
         <br/>
         <div className="d-inline-flex align-items-center w-50 mt-3 text-white">
           <label htmlFor="resultRevealTime" className='col-sm-3 col-form-label' >Result Time :</label>
             <output className="mx-5">{result_reveal_time} </output>
         </div>
       <br/>
     </div>
    </>
  )
}
