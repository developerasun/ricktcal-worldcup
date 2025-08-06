// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

type Proposal is uint256;
type Voter is address;

contract Elif is ERC20, ERC20Burnable, Ownable {
    using ECDSA for bytes32;
    mapping(Proposal => mapping(Voter => VoteCast)) private _participants;

    struct VoteCast {
        bytes32 digest;
        bytes signature;
        bool hasVoted;
    }

    constructor() ERC20("Elif", "elif") Ownable(_msgSender()) {}

    function mint(address to, uint256 amount) public onlyOwner {
        return super._mint(to, amount);
    }

    function burn(address account, uint256 amount) public onlyOwner {
        return super._burn(account, amount);
    }

    function castVote(Proposal p, Voter v, VoteCast memory vc, uint256 amount) external onlyOwner {
        address admin = owner();
        address signer = getRecoveredSigner(vc.digest, vc.signature);

        // @dev prevent signature manipulation by admin
        require(admin != signer, "castVote: only non-admin can vote for proposal");
        require(balanceOf(Voter.unwrap(v)) >= amount, "castVote: not enough elif for the voter");
        require(hasVoted(p, v) == false, "castVote: already voted for this proposal");
        burn(Voter.unwrap(v), amount);
        _participants[p][v] = VoteCast({digest: vc.digest, signature: vc.signature, hasVoted: true});
    }

    // ================================================================== //
    // ============================= getter ============================= //
    // ================================================================== //
    function getRecoveredSigner(bytes32 digest, bytes memory signature) public pure returns (address) {
        (address signer, , ) = ECDSA.tryRecover(digest, signature);
        require(signer != address(0), "getRecoveredSigner: invalid signature");
        return signer;
    }

    function getVoteCastByProposal(Proposal p, Voter v) public view returns (VoteCast memory vc) {
        return (_participants[p][v]);
    }

    function hasVoted(Proposal p, Voter v) public view returns (bool) {
        return getVoteCastByProposal(p, v).hasVoted;
    }
}
