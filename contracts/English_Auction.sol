// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

//import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

//https://www.quicknode.com/guides/solidity/how-to-create-a-dutch-auction-smart-contract
contract English_Auction {

    //The below struct can fit in 2 storage slots  ( 31b + 32b)
    // https://medium.com/@novablitz/storing-structs-is-costing-you-gas-774da988895e
    struct Bidding_item { 
        bytes32 prod_name;  //32byte   # goes to storage slot 0
        uint8 prod_age;    //1byte   # goes to storage slot 1
        address prod_owner;   //20bytes   # goes to storage slot 1
        uint16 starting_amt;  //2bytes    # goes to storage slot 1
        uint32 bid_endTime;  //4bytes  # goes to storage slot 1
        uint32 result_reveal_time;  //4bytes  # goes to storage slot 1 
    }

    struct HighestBidding {
        address bidder;
        uint16 amount;
    }
    
    Bidding_item public s_bidding_item;
    HighestBidding public s_highestBidding;
    
    //immutables stores value in code, wont go to bc storage 
    address public immutable owner;

    address[] public s_bidders;
    mapping (address => uint) public s_rejected_bidderToBid;
    
    //To get the current state of auction
  //  address public s_highestBidder;

    //using unit8 outside struct is memory intensive
   // uint public s_highestBid;


    //https://www.tutorialspoint.com/solidity/solidity_events.htm
    event highestBidding(bytes32  prod_name, address indexed _from,  uint _value);
    event biddingEnded(bytes32  prod_name, address indexed _from,  uint _value);
    event created_bid_item(Bidding_item item);
    
     // set the owner as the address that deployed the contract
    constructor()  {
        owner = msg.sender;
    }


    function create_auction_item(string memory prod_name, uint8 prod_age, uint16 starting_price, uint16 auction_time ) public onlyOwner{
       
       //https://soliditytips.com/articles/solidity-dates-time-operations/
        uint16 time_to_sec = auction_time * 60;
        uint32 bid_endTime = uint32(block.timestamp + time_to_sec);

        uint32 result_reveal_time = bid_endTime +60;
        uint16 amount = starting_price;
        bytes32 name_val = bytes32(bytes(prod_name));

        s_bidding_item = Bidding_item(name_val,prod_age, owner,amount, bid_endTime, result_reveal_time);
      //  emit created_bid_item (s_bidding_item);
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
    
    function stringToBytes(string memory text) public pure returns(bytes32) {
        return bytes32(bytes(text));
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
        if(s_highestBidding.amount >0){
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
        else{
            
        }    
    }

    // End the auction and send the highest bid to the owner.
    function reveal_aution_results() public payable onlyOwner onlyAfterReveal {
        //At the end of reveal time, transfer the amount sucessful bid amount to the owner
        HighestBidding memory bidding = s_highestBidding;  
        if(bidding.amount >0){
            payable(owner).transfer(bidding.amount);
            emit biddingEnded (s_bidding_item.prod_name, bidding.bidder, bidding.amount);
        } 
    }

   // Function to place bid
    function placeBid() internal onlyNotOwner returns(bool success) {

        uint16 current_bid = uint16(msg.value);
        address sender = msg.sender;
        
        HighestBidding memory bidding = s_highestBidding;  
        require(current_bid > bidding.amount, "Increase bid amount");

        s_rejected_bidderToBid[bidding.bidder]+= bidding.amount;
        
        //Push the latest Bidder
        s_bidders.push(sender);
        bidding.amount = current_bid;
        bidding.bidder = sender;

        s_highestBidding = bidding;
        emit highestBidding (s_bidding_item.prod_name, sender, current_bid);

        return true;
    }

    function getAllBidders() public view returns (address [] memory) {
        return s_bidders;
    }
}