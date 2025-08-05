import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { toUtf8Bytes, getBytes } from "ethers";
import hre from "hardhat";

describe("Elif", function () {
  async function useDeployer() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Elif = await hre.ethers.getContractFactory("Elif");
    const elif = await Elif.deploy();

    return { elif, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { elif, owner } = await loadFixture(useDeployer);

      expect(await elif.owner()).to.equal(owner.address);
    });

    it("Should recover right signer", async function () {
      const { elif, owner } = await loadFixture(useDeployer);
      const digest = getBytes("0x23570920339db06ae65725593c584550c31716a0fa8ec4b8748d247db4a53636");
      const signature = getBytes(
        "0x5238c598d31318e32480b3fe6c3215765dc423432f01f60d7ef132fb7ac8b092462d8ed48627e1cd8288ea3c0728a7640aaa38fe1ea33899f6217857f8b218831c",
      );
      const signer = "0x709974eD57E06F78B081D7ccbB47ed598C051356";

      expect(await elif.verify(digest, signature)).to.equal(signer);
    });
  });
});
