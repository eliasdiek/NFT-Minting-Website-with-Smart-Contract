// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "./IAggregatorV3.sol";

contract FathomyachtClub is ERC721URIStorage, ERC2981, Ownable {
  uint256 private MAX_TOKEN = 10000;
  uint256[] private _tokenIds = [8000, 0, 2000, 4000, 6000];

  // mapping for token to tier number(0: power, 1: yacht, 2: prestige)
  mapping(uint256 => uint8) private _tokenToTier;

  // NFT prices in USD, mapping for tier to price(0: power, 1: yacht, 2: prestige)
  uint256[] private NFT_PRICE = [50, 100, 150, 0, 0];
  uint256[] private PRESALE_TIER_MINT_LIMIT = [100, 100, 50, 0, 0];
  uint256[] private PUBLIC_SALE_TIER_MINT_LIMIT = [900, 900, 950, 0, 0];
  string private _tokenBatchURI = "https://fyc.mypinata.cloud/ipfs/QmbhXRfyS53JKMpRQBSgs4s4jpTZGLhWPVcrtkYqHvKXQE/";
  // 0: presale start block, 1: public sale start block
  uint256[] private EVENT_BLOCK = [10264904, 10437473];
  // Mapping from address to minted number of NFTs(0: power, 1: yacht, 2: prestige)
  mapping(uint8 => uint256) private _preSaleMintCounter;
  // Mapping from address to minted number of NFTs(0: power, 1: yacht, 2: prestige)
  mapping(uint8 => uint256) private _publicSaleMintCounter;
  // Mapping from address to white list flag(1: added, 0: removed)
  mapping(address => uint8) private _whitelister;
  // Mapping that returns tokens array of a holder
  mapping(address => uint256[]) private _tokensOfholder;

  AggregatorV3Interface internal priceFeed;

  constructor() ERC721("Fathom Yacht Club", "FYC") {
    _setDefaultRoyalty(msg.sender, 1000);
    priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
  }

  modifier ableMintBatch(uint256 number, uint8 tierNumber) {
    require(NFT_PRICE[tierNumber] != 0, "Tier price is not set.");
    require(number <= 2, "You are not allowed to buy more than 2 tokens at once.");
    require(tierNumber >= 0 && tierNumber <= 4, "Invalied tierNumber of array.");
    require(MAX_TOKEN > number + totalSupply() + 1, "Not enough tokens left to buy.");

    uint8 blockStatus = checkBlock(msg.sender);
    // uint8 blockStatus = 1;
    require(blockStatus > 0, "Not available to mint.");
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

  function getTokensOfHolder(address holder_address) external view returns(uint256[] memory) {
    return _tokensOfholder[holder_address];
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
    require(tierNumber >= 0 && tierNumber <= 4, "Invalied tierNumber of array");
    return (NFT_PRICE[tierNumber] * (10 ** 26)) / uint256(getLatestPrice());
  }

  function setTierPrice(uint256 price, uint8 tierNumber) external onlyOwner {
    require(tierNumber >= 0 && tierNumber <= 4, "Invalied tierNumber of array.");
    NFT_PRICE[tierNumber] = price;
  }

  function getMaxLimit() external view returns(uint256) {
    return MAX_TOKEN;
  }

  function setMaxLimit(uint256 limit) external onlyOwner {
    MAX_TOKEN = limit;
  }

  /**
    * @dev Set tier mint limit per sale season
    *
    * @param _saleNumber 1: Presale, 2: Public Sale
    * @param _tierNumber 0: Power, 1: Yacht, 2: Prestige, 3: Ultra, 4: Reserve
    */
  function getTierMintLimit(uint8 _saleNumber, uint8 _tierNumber) external view returns(uint256) {
    require(_saleNumber >= 1 && _saleNumber <= 2, "saleNumber must be larger than 0. 1: Presale, 2: Public sale");
    require(_tierNumber >= 0 && _tierNumber <= 4, "Invalied tierNumber of array.");

    if (_saleNumber == 1) {
      return PRESALE_TIER_MINT_LIMIT[_tierNumber];
    }
    else {
      return PUBLIC_SALE_TIER_MINT_LIMIT[_tierNumber];
    }
  }

  /**
    * @dev Set tier mint limit per sale season
    *
    * @param _saleNumber 1: Presale, 2: Public Sale
    * @param _limit target address that will receive the tokens
    * @param _tierNumber 0: Power, 1: Yacht, 2: Prestige, 3: Ultra, 4: Reserve
    */
  function setTierMintLimit(uint8 _saleNumber, uint256 _limit, uint8 _tierNumber) external onlyOwner {
    require(_saleNumber >= 1 && _saleNumber <= 2, "saleNumber must be larger than 0. 1: Presale, 2: Public sale");
    require(_tierNumber >= 0 && _tierNumber <= 4, "Invalied tierNumber of array.");

    if (_saleNumber == 1) {
      PRESALE_TIER_MINT_LIMIT[_tierNumber] = _limit;
    }
    else {
      PUBLIC_SALE_TIER_MINT_LIMIT[_tierNumber] = _limit;
    }
  }

  /**
    * @dev Set tier mint limit per sale season
    *
    * @param _saleNumber 1: Presale, 2: Public Sale
    * @param _blockNumber Block number of sale season
    */
  function setSaleEvent(uint8 _saleNumber, uint256 _blockNumber) external onlyOwner {
    require(_saleNumber >= 1 && _saleNumber <= 2, "saleNumber must be larger than 0. 1: Presale, 2: Public sale");
    EVENT_BLOCK[_saleNumber - 1] = _blockNumber;
  }

  function withDraw() external onlyOwner {
    address payable tgt = payable(owner());
    (bool success1, ) = tgt.call{value:address(this).balance}("");
    require(success1, "Failed to Withdraw Ether");
  }

  function setTokenBatchURI(string memory _batchTokenURI) external onlyOwner {
    _tokenBatchURI = _batchTokenURI;
  }

  function setTokenURI(uint256 number, string memory tokenURI) public onlyOwner {
    _setTokenURI(number, tokenURI);
  }

  function mintBatch(uint256 number, uint8 tierNumber) public payable ableMintBatch(number, tierNumber) returns(uint256) {
    require(msg.value >= ((NFT_PRICE[tierNumber] * number) * (10 ** 26)) / uint256(getLatestPrice()), "Amount of ether sent not correct.");

    // refund the remainder
    address payable tgt = payable(msg.sender);
    (bool success1, ) = tgt.call{ value: msg.value - (((NFT_PRICE[tierNumber] * number) * (10 ** 26)) / uint256(getLatestPrice())) }("");
    require(success1, "Failed to refund");

    uint256[] storage tierMintLimit = PRESALE_TIER_MINT_LIMIT;
    mapping(uint8 => uint256) storage tierMintCounter = _preSaleMintCounter;
    uint256 curBlock = block.number;

    // use public sale variables if the current date is after public sale started
    if (curBlock >= EVENT_BLOCK[1]) {
      tierMintLimit = PUBLIC_SALE_TIER_MINT_LIMIT;
      tierMintCounter = _publicSaleMintCounter;
    }
    require(tierMintCounter[tierNumber] + number < tierMintLimit[tierNumber], "Overflow maximum mint limitation.");

    uint256 newItemId = 0;
    // set where start the tokenIds to be incremented

    for (uint256 i = 0; i < number; i++) {
      _tokenIds[tierNumber]++;
      newItemId = _tokenIds[tierNumber];
      _mint(msg.sender, newItemId);
      _tokenToTier[newItemId] = tierNumber;
      _tokensOfholder[msg.sender].push(newItemId);
    }

    tierMintCounter[tierNumber] = tierMintCounter[tierNumber] + number;

    return newItemId;
  }

  function totalSupply() public view returns(uint256) {
    uint256 total = 0;
    for(uint8 i = 0; i < 5; i++) {
      total += (_preSaleMintCounter[i] + _publicSaleMintCounter[i]);
    }
    
    return total;
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

  function setRoality(address receiver, uint96 feeNumerator) external onlyOwner {
    _setDefaultRoyalty(receiver, feeNumerator);
  }

  function getLatestPrice() public view returns (int) {
    (
      ,
      int price,
      ,
      ,
      
    ) = priceFeed.latestRoundData();
    return price;
  }

  // use this for test purpose and delete when deploy on the mainnet
  function getLocalPrice() public pure returns (int) {
    int price = 257508605065;
    return price;
  }

  function _baseURI() internal view override returns (string memory) {
    string memory baseURI = _tokenBatchURI;
    return baseURI;
  }
}
