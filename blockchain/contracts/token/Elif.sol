// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract Elif is ERC20, ERC20Burnable, Ownable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    mapping(uint256 => address) private _participants;

    constructor() ERC20("Elif", "elif") Ownable(_msgSender()) {}

    function mint(address to, uint256 amount) public onlyOwner {
        return super._mint(to, amount);
    }

    function burn(address account, uint256 amount) public onlyOwner {
        return super._burn(account, amount);
    }

    function verify(bytes32 digest, bytes memory signature) public pure returns (address) {
        (address signer, , ) = ECDSA.tryRecover(digest, signature);
        require(signer != address(0), "verify: invalid signature");
        return signer;
    }
}
