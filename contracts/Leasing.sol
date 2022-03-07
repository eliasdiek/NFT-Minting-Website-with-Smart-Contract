// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IFYC is IERC721 {
    function totalSupply() external view returns(uint256 number);
    function getTierNumberOf(uint256 _tokenId) external view returns(uint8 tierNumber);
    function getTierPrice(uint8 tierNumber) external view returns(uint256 tierPrice);
    function royaltyInfo(uint256 _tokenId, uint256 _salePrice) external view returns (address roalityReceiver, uint256 royaltyAmount);
    function setRoality(address receiver, uint96 feeNumerator) external;
}

contract Leasing is Ownable {
    event ApproveLeasing(uint tokenId);

    IFYC _nft;
    uint8 private _refundPercentFee = 98;

    struct LeaseOffer {
        address from;
        uint256 price;
        uint32 expiresIn;
    }
    mapping (uint256 => LeaseOffer) private _lease;
    mapping(uint256 => mapping(address => bool)) _offerState;
    mapping (uint256 => LeaseOffer[]) leaseOffers;
    mapping (uint256 => bool) leasable;
    uint256 leasableTokenCount = 0;
    mapping (uint256 => uint256) leasePrices;
    
    modifier onlyOwnerOf(uint256 _tokenId) {
        require(msg.sender == address(_nft.ownerOf(_tokenId)), "caller is not the owner of token");
        _;
    }

    function getNFTAddress() external view returns(address) {
        return address(_nft);
    }

    function setNFTAddress(address nft_address) external onlyOwner {
        _nft = IFYC(nft_address);
    }

    function withDraw() external onlyOwner {
        address payable tgt = payable(owner());
        (bool success1, ) = tgt.call{value:address(this).balance}("");
        require(success1, "Failed to Withdraw VET");
    }

    function getRoalityInfo(uint256 _tokenId, uint256 _salePrice) public view returns(address, uint256) {
        (address roalityReceiver, uint256 royaltyAmount) = _nft.royaltyInfo(_tokenId, _salePrice);

        return (roalityReceiver, royaltyAmount);
    }

    /**
     * @dev The denominator with which to interpret the fee set in {_setTokenRoyalty} and {_setDefaultRoyalty} as a
     * fraction of the sale price. Defaults to 10000 so fees are expressed in basis points.
     */
    function setRoality(address receiver, uint96 feeNumerator) external onlyOwner {
        _nft.setRoality(receiver, feeNumerator);
    }

    function getRefundFee() external view returns(uint8) {
        return _refundPercentFee;
    }

    function setRefundFee(uint8 fee) external onlyOwner {
        require(fee > 0 && fee <100, "Invalied percentage value");
        _refundPercentFee = fee;
    }

    function getLeasable(uint256 _tokenId) external view returns(bool) {
        if(leasable[_tokenId]) return true;
        else return false;
    }

    function setLeasable(uint256 _tokenId, uint256 _price) external onlyOwnerOf(_tokenId) {
        leasable[_tokenId] = true;
        leasePrices[_tokenId] = _price;
        leasableTokenCount++;
    }

    function getLeasePrice(uint256 _tokenId) external view returns(uint256) {
        return leasePrices[_tokenId];
    }

    function setLeasePrice(uint256 _tokenId, uint256 _price) external onlyOwnerOf(_tokenId) {
        leasePrices[_tokenId] = _price;
    }

    function getLeaseOffers(uint256 _tokenId) external view onlyOwnerOf(_tokenId) returns(LeaseOffer[] memory) {
        return leaseOffers[_tokenId];
    }

    function approveLeaseOffer(uint256 _tokenId, address _from) external onlyOwnerOf(_tokenId) {
        LeaseOffer[] memory tokenLeaseOffers = leaseOffers[_tokenId];

        for(uint256 i = 0; i < tokenLeaseOffers.length; i++) {
            if(tokenLeaseOffers[i].from == _from) {
                (address royaltyReceiver, uint256 roaltyAmount) = getRoalityInfo(_tokenId, tokenLeaseOffers[i].price);
                address payable _royaltyReceiver = payable(royaltyReceiver);
                (bool success1, ) = _royaltyReceiver.call{ value: roaltyAmount }("");
                require(success1, "Failed to Pay Royalty fee");
                _lease[_tokenId] = tokenLeaseOffers[i];
                delete leaseOffers[_tokenId][i];

                emit ApproveLeasing(_tokenId);
                break;
            }
        }
        _offerState[_tokenId][_from] = false;
        leasableTokenCount--;
    }

    function calcenLeaseOffer(uint256 _tokenId) external {
        require(_nft.ownerOf(_tokenId) != msg.sender, "You can't buy yours.");
        require(_nft.ownerOf(_tokenId) != address(0), "You can't send offer no-owner token");
        LeaseOffer[] memory tokenLeaseOffers = leaseOffers[_tokenId];

        for(uint256 i = 0; i < tokenLeaseOffers.length; i++) {
            if(tokenLeaseOffers[i].from == msg.sender) {
                (bool success1, ) = msg.sender.call{ value: tokenLeaseOffers[i].price * _refundPercentFee / 100 }("");
                require(success1, "Failed to refund");
                delete leaseOffers[_tokenId][i];

                emit ApproveLeasing(_tokenId);
                break;
            }
        }

        _offerState[_tokenId][msg.sender] = false;
    }

    function getLeasableTokens() external view returns(uint256[] memory) {
        uint256[] memory leasableTokenIds = new uint256[](leasableTokenCount);

        uint256 counter = 0;
        for(uint256 i = 1; i <= _nft.totalSupply(); i++) {
            if (leasable[i]) {
                leasableTokenIds[counter] = i;
                counter++;
            }
        }

        return leasableTokenIds;
    }

    function sendLeaseOffer(uint256 _tokenId, uint32 _expiresIn) public payable {
        require(_nft.ownerOf(_tokenId) != msg.sender, "You can't buy yours.");
        require(_nft.ownerOf(_tokenId) != address(0), "You can't send offer no-owner token");
        require(msg.value >= _nft.getTierPrice(_nft.getTierNumberOf(_tokenId)) / 10, "Amount of ether sent not correct.");
        require(_expiresIn >= 30, "The minimum to lease the membership is 30 days.");
        require(_offerState[_tokenId][msg.sender] != true, "You can't send mutli offer");
        leaseOffers[_tokenId].push(LeaseOffer(msg.sender, msg.value, _expiresIn));
        _offerState[_tokenId][msg.sender] = true;
    }

    function lease(uint256 _tokenId, uint32 _expiresIn) external payable {
        require(_nft.ownerOf(_tokenId) != msg.sender, "You can't buy yours.");
        require(leasable[_tokenId], "Token is not public");
        require(_nft.ownerOf(_tokenId) != address(0), "You can't send offer no-owner token");
        require(msg.value >= leasePrices[_tokenId], "Amount of ether sent not enough.");

        (address royaltyReceiver, uint256 roaltyAmount) = getRoalityInfo(_tokenId, msg.value);
        address payable _royaltyReceiver = payable(royaltyReceiver);
        (bool success1, ) = _royaltyReceiver.call{ value: roaltyAmount }("");
        require(success1, "Failed to Pay Royalty fee");

        _lease[_tokenId] = LeaseOffer(msg.sender, msg.value, _expiresIn);
        leasable[_tokenId] = false;
        leasableTokenCount--;
    }
}