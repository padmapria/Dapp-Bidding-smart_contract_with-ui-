// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

//import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

//https://www.quicknode.com/guides/solidity/how-to-create-a-dutch-auction-smart-contract
contract English_Auction {

    //The below struct can fit in 1 storage slots  ( <32b)
    // https://medium.com/@novablitz/storing-structs-is-costing-you-gas-774da988895e
    struct Bidding_item {
        address prod_owner;   //20bytes   # goes to storage slot 0
        uint32 bid_endTime;  //4bytes  # goes to storage slot 0
        uint32 result_reveal_time;
        uint8 prod_age;    //1byte   # goes to storage slot 0
        uint16 starting_amt;  //2bytes    # goes to storage slot 0
    }
    
    Bidding_item public s_bidding_item;
    
    //immutables stores value in code, wont go to bc storage 
    address public immutable owner;

    address[] public s_bidders;
    mapping (address => uint) public s_rejected_bidderToBid;
    
    //To get the current state of auction
    address public s_highestBidder;

    //using unit8 outside struct is memory intensive
    uint public s_highestBid;


    //https://www.tutorialspoint.com/solidity/solidity_events.htm
    event highestBidding(bytes32  prod_name, address indexed _from,  uint _value);
    event biddingEnded(bytes32  prod_name, address indexed _from,  uint _value);
    
     // set the owner as the address that deployed the contract
    constructor()  {
        owner = msg.sender;
    }


    function create_auction_item(uint8 prod_age, uint16 starting_amt, uint16 end_time_mins) public onlyOwner{
       
       //https://soliditytips.com/articles/solidity-dates-time-operations/
        uint16 time_to_sec = end_time_mins * 60;
        uint32 bid_endTime = uint32(block.timestamp + time_to_sec);

        uint32 result_reveal_time = bid_endTime +60;
        uint32 amount = starting_amt;
        
        s_bidding_item = Bidding_item(owner, bid_endTime, result_reveal_time, prod_age, starting_amt);
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
        require(block.timestamp < s_bidding_item.bid_endTime);
        _;
    }

    modifier onlyAfterEnd() {
        require(block.timestamp > s_bidding_item.bid_endTime);
        _;
    }

    modifier onlyAfterReveal() {
        require(block.timestamp > s_bidding_item.result_reveal_time);
        _;
    }
    
    /// Withdraw a bid that was lesser than the current highest bid, even before auction end
    function withdraw() public onlyNotOwner returns(bool success){
        address sender = msg.sender;

        uint bid_amount = s_rejected_bidderToBid[sender];

        if(bid_amount > 0) {
            //only with send we will be able to check if transfer is success or not
            if(payable(sender).send(bid_amount)){
                s_rejected_bidderToBid[sender] = 0;
                return true;
            }
            else{
                return false;
            }
        }
    }

    //Return the money of all unsuccessful bidders to the bidders   
    function auctionEnd() public payable onlyOwner onlyAfterEnd {

        address [] memory bidders = s_bidders;

        //Loop thru the bidders
        for (uint i=0; i<bidders.length ; i++) {
            
            uint bid_amount = s_rejected_bidderToBid[bidders[i]];
            
            //If unsuccessful bidder has not withdrawan his amount till the auction end
            if(bid_amount > 0){
                payable(bidders[i]).transfer (bid_amount);

                 //Since dont need to return any amount
                s_rejected_bidderToBid[bidders[i]] = 0;
            }           
        }
    }

    // End the auction and send the highest bid to the owner.
    function reveal_aution_results() public payable onlyOwner onlyAfterReveal {
        //At the end of reveal time, transfer the amount sucessful bid amount to the owner
        
        uint highestBid = s_highestBid;
        payable(owner).transfer(s_highestBid);
        emit biddingEnded (s_bidding_item.prod_name, s_highestBidder, s_highestBid);
    }

   // Function to place bid
    function placeBid() internal onlyNotOwner returns(bool success) {

        uint amount = msg.value;
        address sender = msg.sender;
        
        require(amount > s_highestBid, "Increase bid amount");

        s_rejected_bidderToBid[s_highestBidder]+= s_highestBid;
        
        //Push the latest Bidder
        s_bidders.push(sender);
        s_highestBid = amount;
        s_highestBidder = sender;

        emit highestBidding (s_bidding_item.prod_name, sender, amount);

        return true;
    }

    function getAllBidders() public view returns (address [] memory) {
        return s_bidders;
    }
}