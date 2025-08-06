import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { toUtf8Bytes, getBytes, parseEther, Interface } from "ethers";
import hre from "hardhat";
import fs from "fs/promises";

describe("Elif", function () {
  async function useDeployer() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Elif = await hre.ethers.getContractFactory("Elif");
    const elif = await Elif.deploy();

    // @dev use pre-generated signing values on frontend for test
    const digest = getBytes("0x23570920339db06ae65725593c584550c31716a0fa8ec4b8748d247db4a53636");
    const signature = getBytes(
      "0x5238c598d31318e32480b3fe6c3215765dc423432f01f60d7ef132fb7ac8b092462d8ed48627e1cd8288ea3c0728a7640aaa38fe1ea33899f6217857f8b218831c",
    );
    const signer = "0x709974eD57E06F78B081D7ccbB47ed598C051356";
    const voteCast = { digest, signature, signer };

    return { elif, owner, otherAccount, voteCast };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { elif, owner } = await loadFixture(useDeployer);

      expect(await elif.owner()).to.equal(owner.address);
    });

    it("Should recover right signer", async function () {
      const { elif, owner, voteCast } = await loadFixture(useDeployer);
      const { digest, signature, signer } = voteCast;

      expect(await elif.getRecoveredSigner(digest, signature)).to.equal(signer);
    });

    it("Should cast vote for proposal(worldcup)", async function () {
      const { elif, owner, otherAccount: voter, voteCast } = await loadFixture(useDeployer);
      const { digest, signature, signer } = voteCast;
      const proposalId = 1;

      // @dev immitate point-elif exchange on client
      const eliftAmountAsVotingPower = parseEther("10");
      await elif.connect(owner).mint(voter.address, eliftAmountAsVotingPower);

      await elif.castVote(proposalId, voter.address, { digest, signature, hasVoted: false }, eliftAmountAsVotingPower);
      // @dev use pre-generated signing values on frontend for test

      expect(await elif.hasVoted(proposalId, voter.address)).to.be.true;
      console.log(await elif.getVoteCastByProposal(proposalId, voter.address));
    });

    it.only("Should export human-friendly abi", async function () {
      const abi = (await hre.artifacts.readArtifact("Elif")).abi;
      const iface = Interface.from(abi);
      const v = await fs.writeFile(`${process.cwd()}/Elif.abi.txt`, JSON.stringify(iface.format(), null, 2));

      expect(v).to.be.not.true;
    });
  });
});
