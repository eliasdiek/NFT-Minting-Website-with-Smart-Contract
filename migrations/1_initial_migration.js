const FathomyachtClub = artifacts.require("FathomyachtClub");
const Leasing = artifacts.require("Leasing");

module.exports = function (deployer) {
  deployer.deploy(FathomyachtClub);
  deployer.deploy(Leasing);
};
