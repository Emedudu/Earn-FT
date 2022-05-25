pragma solidity ^0.8.0;
// import dependencies
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
// import "./Token.sol";

contract MarketPlace{
    // total number of uploaded items
    uint public itemsCount;
    // a mapping of number of items to the items
    mapping(uint=>Item) public itemsForSale;
    // a mapping of id of items to the item
    // mapping(uint=>Item) public itemId_Item;
    // variables modified by deployer
    address payable public feeBank;
    uint public percentage;
    // description of an nft item on the marketplace
    struct Item{
        IERC721 item;
        uint id;
        address payable creator;
        uint price;
        bool sold;
    }
    // event emitted when seller uploads nft to marketplace
    event Uploaded(address market,uint price,uint itemId,address indexed adress);
    // event emitted when buyer nuys nft from marketplace
    event Bought(address seller,uint price,uint itemId,address indexed adress);
    // deployer gives the fees address and the percentage of fee per item
    constructor(uint feePercent){
        feeBank=payable(msg.sender);
        percentage=feePercent;
    }
    // modifier for only owner of NFT
    modifier onlyOwner(uint itemNumber) {
      require(msg.sender == itemsForSale[itemNumber].creator,'Only owner can do this');
      _;
    }
    // seller uploads nft to marketplace (accepts as arguments NFT instance,tokenId, and price)
    function uploadNFT(IERC721 nft,uint itemId,uint price) public{
        // price of an item cannot be negative
        require(price>=0,"Enter a valid price");
        // transfer ownership to the marketplace needs the approve function called
        nft.transferFrom(msg.sender,address(this),itemId);
        // increase the item count
        itemsCount++;
        // map the item count to its id
        itemsForSale[itemsCount]=Item({
            item:nft,
            id:itemId,
            creator:payable(msg.sender),
            price:price,
            sold:false
        });

        // emit the uploaded event
        emit Uploaded(address(this),price,itemId,msg.sender);
    }
    // buyer buys nft
    function buyNFT(uint itemNumber)public payable{
        // get the item object using the number
        Item storage item=itemsForSale[itemNumber];
        // get the total fee (price of the item + market fee)
        uint totalPrice=calc_totalFee(itemNumber);
        // item must be among those listed on the marketplace
        require(itemNumber>0 && itemNumber<=itemsCount,'Please enter a valid id');
        // item should not have been sold
        require (!(item.sold),'This item is not available for sale');
        // buyer must have enough ether to cover both price and market fee
        require (msg.value>=totalPrice,'You do not have enough ether to purchase this item');
        // transfer price to creator of the nft
        item.creator.transfer(item.price);
        // transfer market fee
        feeBank.transfer(totalPrice-item.price);
        // update the sold attribute
        item.sold=true;
        // finally transfer the nft from the marketplace to the buyer
        item.item.transferFrom(address(this),msg.sender,item.id);
        // event emitted when buyer buys nft
        emit Bought(item.creator,item.price,item.id,msg.sender);
    }
    function removeNFT(uint itemNumber)public onlyOwner(itemNumber){
        Item storage itm=itemsForSale[itemNumber];
        itm.item.transferFrom(address(this),msg.sender,itm.id);
        itm.sold=true;
    }
    // calculate the total fee for buyer
    function calc_totalFee(uint itemNumber) public view returns(uint){
        uint amount=itemsForSale[itemNumber].price;
        uint ans=(amount+(amount*percentage/100));
        return ans;
    }
}
