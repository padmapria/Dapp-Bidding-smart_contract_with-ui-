// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

//import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

//https://www.quicknode.com/guides/solidity/how-to-create-a-dutch-auction-smart-contract
contract English_Auction {

    struct Bidding_item {
        string prod_name;
        uint prod_age;
        address prod_owner;
        uint starting_amt;
        uint bid_endTime;
        uint result_reveal_time;
    }
    
    Bidding_item public bidding_item;
    address public owner;
    address[]  bidder;
    mapping (address => uint) public rejected_bidderToBid;
    
    //To get the current state of auction
    address public highestBidder;
    uint public highestBid;

    //https://www.tutorialspoint.com/solidity/solidity_events.htm
    event highestBidding(string prod_name, address indexed _from,  uint _value);
    event biddingEnded(string prod_name, address indexed _from,  uint _value);
    
     // set the owner as the address that deployed the contract
    constructor()  {
        owner = msg.sender;
    }

    function create_auction_item(string memory prod_name,uint prod_age, uint starting_amt, uint biddingDuration, uint reveal_time) public onlyOwner{
        
        uint amount = starting_amt *  10**18; //usd
        uint bid_endTime = block.timestamp + biddingDuration;
        uint result_reveal_time = bid_endTime+reveal_time;
        bidding_item = Bidding_item(prod_name, prod_age,owner, amount,bid_endTime,result_reveal_time);
    }


    modifier onlyNotOwner {
        require(msg.sender != owner);
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyBeforeEnd() {
        require(block.timestamp < bidding_item.bid_endTime);
        _;
    }

    modifier onlyAfterEnd() {
        require(block.timestamp > bidding_item.bid_endTime);
        _;
    }

    modifier onlyAfterReveal() {
        require(block.timestamp > bidding_item.result_reveal_time);
        _;
    }
    
    /// Withdraw a bid that was lesser than the current highest bid, even before auction end
    function withdraw() public onlyNotOwner returns(bool success){
        uint bid_amount = rejected_bidderToBid[msg.sender];

        if(bid_amount > 0) {
            //only with send we will be able to check if transfer is success or not
            if(!payable(msg.sender).send(bid_amount)){
                return false;
            }
            else{
                rejected_bidderToBid[msg.sender] = 0;
                return true;
            }
        }
    }

    //Return the money of all unsuccessful bidders to the bidders   
    function auctionEnd() public payable onlyOwner onlyAfterEnd {

        //Loop thru the bidders
        for (uint i=0; i<bidder.length ; i++) {
            
            //If unsuccessful bidder has not withdrawan his amount till the auction end
            if(rejected_bidderToBid[bidder[i]] > 0){
                payable(bidder[i]).transfer (rejected_bidderToBid[bidder[i]] );

                 //Since dont need to return any amount
                rejected_bidderToBid[bidder[i]] = 0;
            }           
        }
    }

    // End the auction and send the highest bid to the owner.
    function reveal_aution_results() public payable onlyOwner onlyAfterReveal {
        //At the end of reveal time, transfer the amount sucessful bid amount to the owner
        payable(owner).transfer(highestBid);
        emit biddingEnded (bidding_item.prod_name, highestBidder, highestBid);
    }

   // Function to place bid
    function placeBid() internal onlyNotOwner returns(bool success) {

        uint amount = msg.value;
        //Check bidder is already added
        if(rejected_bidderToBid[msg.sender] != 0){
            amount+= msg.value;
        }

         require(amount < bidding_item.starting_amt, "The  bidding amount must be more than the min bid amount");
         require(amount > highestBid, "You must pay higher amount than the current highest bid");

        rejected_bidderToBid[highestBidder] += highestBid;
        //Push the latest Bidder
        bidder.push(msg.sender);
        highestBid = amount;
        highestBidder = msg.sender;

        emit highestBidding (bidding_item.prod_name, highestBidder, highestBid);

        return true;
    }

    function getAllBidders() public view returns (address [] memory) {
        return bidder;
    }
}