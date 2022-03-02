// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";

contract FathomyachtClub is ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  uint256 private MAX_TOKEN = 8000;

  uint256 private _powerCount = 0;
  uint256 private _yachtCount = 0;
  uint256 private _prestigeCount = 0;

  // mapping for token to tier number(1: power, 2: yacht, 3: prestige)
  mapping(uint256 => uint8) private _tokenToTier;

  // array for token URIs(0: power, 1: yacht, 2: prestige)
  string[] private _batchTokenURI = [
    "https://gateway.pinata.cloud/ipfs/Qmd65WNW1B8Z3UCG5AvNUYo1vP2yXBwboJVKB57LR2Ww9t",
    "https://gateway.pinata.cloud/ipfs/QmP3mVHt5GgiUQt1xA9Yho5CjWPtBqqWuHw4VGQJeBVpe7",
    "https://gateway.pinata.cloud/ipfs/QmXn2VsBujETLvCKdy7kHzEVevQ6cBrp6Nc9WgMd9ggQKr"
  ];

  // mapping for tier to price(1: power, 2: yacht, 3: prestige)
  uint256[] private NFT_PRICE = [0, 0, 0];
  uint8[] private TIER_MINT_LIMIT = [100, 100, 50];
  // Mapping from address to white list flag(1: added, 0: removed)
  mapping(address => uint8) private _whitelister;

  constructor() ERC721("Fathom Yacht Club", "FYC") {}

  modifier ableBatch(uint8 tierNumber) {
    require(keccak256(abi.encodePacked(_batchTokenURI[tierNumber])) != keccak256(abi.encodePacked("")), "Batch Token URI not set");
    _;
  }

  function addWhiteList(address[] memory lsts) public onlyOwner {
    uint256 new_len = lsts.length;
    for(uint256 i=0; i<new_len; i++) {
      _whitelister[lsts[i]] = 1;
    }
  }

  function removeWhiteList(address[] memory lsts) public onlyOwner {
    uint256 new_len = lsts.length;
    for(uint256 i=0; i<new_len; i++) {
      _whitelister[lsts[i]] = 0;
    }
  }

  function getTierPrice(uint8 tierNumber) external view onlyOwner returns(uint256) {
    require(tierNumber >= 1 && tierNumber <= 3, "Invalied tierNumber of array");
    return NFT_PRICE[tierNumber];
  }

  function setTierPrice(uint256 price, uint8 tierNumber) external onlyOwner {
    require(tierNumber >= 1 && tierNumber <= 3, "Invalied tierNumber of array.");
    NFT_PRICE[tierNumber] = price;
  }

  function getTokenBatchURI(uint8 tierNumber) external view onlyOwner returns(string memory) {
    require(tierNumber >= 1 && tierNumber <= 3, "Invalied tierNumber of array.");
    return _batchTokenURI[tierNumber];
  }

  function setTokenBatchURI(string memory tokenURI, uint8 tierNumber) public onlyOwner {
    require(tierNumber >= 0 && tierNumber <= 2, "Invalied tierNumber of array.");
    _batchTokenURI[tierNumber] = tokenURI;
  }

  function getMaxLimit() external view returns(uint256) {
    return MAX_TOKEN;
  }

  function setMaxLimit(uint256 limit) external onlyOwner {
    MAX_TOKEN = limit;
  }

  function withDraw() external onlyOwner {
    address payable tgt = payable(owner());
    (bool success1, ) = tgt.call{value:address(this).balance}("");
    require(success1, "Failed to Withdraw Ether");
  }

  function setTokenURI(uint256 number, string memory tokenURI) public onlyOwner {
    _setTokenURI(number, tokenURI);
  }

  function mintBatch(uint256 number, uint8 tierNumber) public payable ableBatch(tierNumber-1) returns(uint256) {
    uint8 maxBatchable = 2;
    require(tierNumber >= 1 && tierNumber <= 3, "Invalied tierNumber of array.");
    require(NFT_PRICE[tierNumber] != 0, "Tier price is not set.");
    require(number < maxBatchable, "You are not allowed to buy more than 2 tokens at once.");
    require(MAX_TOKEN > number + _tokenIds.current() + 1, "Not enough tokens left to buy.");
    require(msg.value >= NFT_PRICE[tierNumber] * number, "Amount of ether sent not correct.");

    uint256 newItemId = 0;
    for (uint256 i = 0; i < number; i++) {
      _tokenIds.increment();
      newItemId = _tokenIds.current();
      _mint(msg.sender, newItemId);
      _setTokenURI(newItemId, _batchTokenURI[tierNumber - 1]);
      _tokenToTier[newItemId] = tierNumber;
    }

    return newItemId;
  }
}
