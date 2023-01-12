//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./ERC1155.sol";
import "./Ownable.sol";

contract rewardTwo is ERC1155, Ownable {
    string name_;
    string symbol_;

    mapping(address => bool) minted;

    constructor()
        ERC1155(
            "https://ipfs.io/ipfs/QmYJKPy7i7CQGzEkukrkYzYDNRDCd4hqjuQYYR978PqHcr/reward2meta.json"
        )
    {
        name_ = "BrightWay";
        symbol_ = "BRTW";
        Status.mintStatus = true;
    }

    struct status {
        bool mintStatus;
    }

    status Status;

    string tokenURI =
        "https://ipfs.io/ipfs/QmYJKPy7i7CQGzEkukrkYzYDNRDCd4hqjuQYYR978PqHcr/reward2meta.json";

    function name() public view returns (string memory) {
        return name_;
    }

    function symbol() public view returns (string memory) {
        return symbol_;
    }

    function uri(uint256) public view override returns (string memory) {
        return tokenURI;
    }

    function mintReward() public returns (bool mintResult) {
        require(Status.mintStatus, "mint is not available!");
        require(minted[_msgSender()], "you have clamied your reward once!");

        _mint(_msgSender(), 2, 1, "");
        minted[_msgSender()] = true;
        return (true);
    }

    function getminted(address user) public view returns (bool) {
        return minted[user];
    }

    function setMintStatus(bool _mintStatus) public onlyOwner {
        Status.mintStatus = _mintStatus;
    }
}
