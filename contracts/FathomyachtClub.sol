// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

contract FathomyachtClub is ERC721URIStorage, ERC2981, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  uint256 private MAX_TOKEN = 8000;

  uint256 private _powerCount = 0;
  uint256 private _yachtCount = 0;
  uint256 private _prestigeCount = 0;

  // mapping for token to tier number(0: power, 1: yacht, 2: prestige)
  mapping(uint256 => uint8) private _tokenToTier;

  // array for token URIs(0: power, 1: yacht, 2: prestige)
  string[] private _batchTokenURI = [
    "https://gateway.pinata.cloud/ipfs/Qmd65WNW1B8Z3UCG5AvNUYo1vP2yXBwboJVKB57LR2Ww9t",
    "https://gateway.pinata.cloud/ipfs/QmP3mVHt5GgiUQt1xA9Yho5CjWPtBqqWuHw4VGQJeBVpe7",
    "https://gateway.pinata.cloud/ipfs/QmXn2VsBujETLvCKdy7kHzEVevQ6cBrp6Nc9WgMd9ggQKr"
  ];

  // mapping for tier to price(0: power, 1: yacht, 2: prestige)
  uint256[] private NFT_PRICE = [0, 0, 0];
  uint256[] private PRESALE_TIER_MINT_LIMIT = [100, 100, 50];
  uint256[] private PUBLIC_SALE_TIER_MINT_LIMIT = [900, 900, 950];
  // 0: presale start block, 1: public sale start block
  uint256[] private EVENT_BLOCK = [10264904, 10437473];
  // Mapping from address to minted number of NFTs(0: power, 1: yacht, 2: prestige)
  mapping(uint8 => uint256) private _preSaleMintCounter;
  // Mapping from address to minted number of NFTs(0: power, 1: yacht, 2: prestige)
  mapping(uint8 => uint256) private _publicSaleMintCounter;
  // Mapping from address to white list flag(1: added, 0: removed)
  mapping(address => uint8) private _whitelister;

  constructor() ERC721("Fathom Yacht Club", "FYC") {}

  modifier ableMintBatch(uint256 number, uint8 tierNumber) {
    uint8 blockStatus = checkBlock(msg.sender);
    require(blockStatus > 0, "Not available to mint.");
    require(keccak256(abi.encodePacked(_batchTokenURI[tierNumber])) != keccak256(abi.encodePacked("")), "Batch Token URI not set");
    _;
  }

  function checkBlock(address pm_address) internal view returns(uint8) {
    uint256 curBlock = block.number;

    if (curBlock >= EVENT_BLOCK[1]) {
      return 2;
    }
    if (curBlock >= EVENT_BLOCK[0]) {
      if(_whitelister[pm_address]== 1) {
        return 1;
      }
    }

    return 0;
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

  function getTierNumberOf(uint256 _tokenId) public view returns(uint8) {
    return _tokenToTier[_tokenId];
  }

  function getTierPrice(uint8 tierNumber) public view returns(uint256) {
    require(tierNumber >= 0 && tierNumber <= 2, "Invalied tierNumber of array");
    return NFT_PRICE[tierNumber];
  }

  function setTierPrice(uint256 price, uint8 tierNumber) external onlyOwner {
    require(tierNumber >= 0 && tierNumber <= 2, "Invalied tierNumber of array.");
    NFT_PRICE[tierNumber] = price;
  }

  function getTokenBatchURI(uint8 tierNumber) external view returns(string memory) {
    require(tierNumber >= 0 && tierNumber <= 2, "Invalied tierNumber of array.");
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

  function getTierLimit(uint8 tierNumber) external view returns(uint256) {
    require(tierNumber >= 0 && tierNumber <= 2, "Invalied tierNumber of array.");

    uint256 curBlock = block.number;
    if (curBlock >= EVENT_BLOCK[1]) {
      return PUBLIC_SALE_TIER_MINT_LIMIT[tierNumber];
    }
    if (curBlock >= EVENT_BLOCK[0]) {
      return PRESALE_TIER_MINT_LIMIT[tierNumber];
    }

    return 0;
  }

  function setTierMintLimit(uint256 limit, uint8 tierNumber) external onlyOwner {
    require(tierNumber >= 0 && tierNumber <= 2, "Invalied tierNumber of array.");

    uint256 curBlock = block.number;
    if (curBlock >= EVENT_BLOCK[1]) {
      PUBLIC_SALE_TIER_MINT_LIMIT[tierNumber] = limit;
    }
    if (curBlock >= EVENT_BLOCK[0]) {
      PRESALE_TIER_MINT_LIMIT[tierNumber] = limit;
    }
  }

  function withDraw() external onlyOwner {
    address payable tgt = payable(owner());
    (bool success1, ) = tgt.call{value:address(this).balance}("");
    require(success1, "Failed to Withdraw Ether");
  }

  function setTokenURI(uint256 number, string memory tokenURI) public onlyOwner {
    _setTokenURI(number, tokenURI);
  }

  function mintBatch(uint256 number, uint8 tierNumber) public payable ableMintBatch(number, tierNumber) returns(uint256) {
    require(tierNumber >= 0 && tierNumber <= 2, "Invalied tierNumber of array.");
    require(NFT_PRICE[tierNumber] != 0, "Tier price is not set.");
    require(MAX_TOKEN > number + _tokenIds.current() + 1, "Not enough tokens left to buy.");
    require(msg.value >= NFT_PRICE[tierNumber] * number, "Amount of ether sent not correct.");

    uint8 maxBatchable = 2;
    require(number < maxBatchable, "You are not allowed to buy more than 2 tokens at once.");

    uint256[] storage tierMintLimit = PRESALE_TIER_MINT_LIMIT;
    mapping(uint8 => uint256) storage tierMintCounter = _preSaleMintCounter;
    uint256 curBlock = block.number;

    // use public sale variables if the current date is after public sale started
    if (curBlock >= EVENT_BLOCK[1]) {
      tierMintLimit = PUBLIC_SALE_TIER_MINT_LIMIT;
      tierMintCounter = _publicSaleMintCounter;
    }
    require(tierMintCounter[tierNumber] + number < tierMintLimit[tierNumber], "Overflow maximum mint limitation.");

    tierMintCounter[tierNumber] = tierMintCounter[tierNumber] + number;

    uint256 newItemId = 0;
    for (uint256 i = 0; i < number; i++) {
      _tokenIds.increment();
      newItemId = _tokenIds.current();
      _mint(msg.sender, newItemId);
      _setTokenURI(newItemId, _batchTokenURI[tierNumber]);
      _tokenToTier[newItemId] = tierNumber;
    }

    return newItemId;
  }

  function totalSupply() public view returns(uint256) {
    return _tokenIds.current();
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC2981) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  /**
    * @dev See {ERC721-_burn}. This override additionally clears the royalty information for the token.
    */
  function _burn(uint256 tokenId) internal virtual override {
    super._burn(tokenId);
    _resetTokenRoyalty(tokenId);
  }

  function setRoality(address receiver, uint96 feeNumerator) external {
    _setDefaultRoyalty(receiver, feeNumerator);
  }
}
