// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ElifModule = buildModule("ElifModule", (m) => {
  const elif = m.contract("Elif");

  return { elif };
});

export default ElifModule;
