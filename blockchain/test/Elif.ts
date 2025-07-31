import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Elif", function () {
  async function useDeployer() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Elif = await hre.ethers.getContractFactory("Elif");
    const elif = await Elif.deploy(owner.address);

    return { elif, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const { elif } = await loadFixture(useDeployer);

      expect(await elif.name()).to.equal("Elif");
    });
  });
});
