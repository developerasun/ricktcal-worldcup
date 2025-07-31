module.exports = {
  overrides: [
    {
      files: "*.sol",
      options: {
        explicitTypes: "preserve",
        printWidth: 120,
      },
    },
    {
      files: "*.{js,ts}",
      options: {
        printWidth: 150,
      },
    },
    {
      files: "hardhat.config.ts",
      options: {
        printWidth: 80,
      },
    },
  ],
};
