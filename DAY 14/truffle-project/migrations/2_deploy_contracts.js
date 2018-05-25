const PublicArticle = artifacts.require('PublicArticle.sol');

module.exports = function(deployer) {
    deployer.deploy(PublicArticle);
};