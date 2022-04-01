var ethers = require('ethers');


var Staker = artifacts.require("./Staker.sol");
var Rew = artifacts.require("./RewardToken.sol");
//var MyTokenToBeStaked = artifacts.require("./MyTokenToBeStaked.sol");

module.exports = async function(deployer, network, accounts) {



  // console.log("****** DEPLOY STAKED TOKEN **************************");
  // await deployer.deploy(MyTokenToBeStaked,"TIBALDO","TIB");
  // const instanceTib = await MyTokenToBeStaked.deployed();
  // console.log("adress staked token "+instanceTib);

  console.log("****** DEPLOY STAKER CONTRACT **************************");
  await deployer.deploy(Staker,"0xAa7F6f7f507457a1EE157fE97F6c7DB2BEec5cD0");// use kovan chainlink registry
  const instanceStaker = await Staker.deployed();
  console.log("adress staker "+instanceStaker);

  console.log("****** DEPLOY REWARD TOKEN **************************");
  await deployer.deploy(Rew,"REWARD","REW",instanceStaker.address);
  const instanceRew = await Rew.deployed();
  console.log("adress rew token "+instanceRew);



  console.log("****** CALL SET REWARD TOKEN TO STAKER **************************");
  // const instanceStaker = await Staker.deployed();
  // const instanceRew = await RewToken.deployed();
  // const instanceTib = await MyTokenToBeStaked.deployed();


  await instanceStaker.setRewardToken(Rew.address);

  // // transfer some token to a user so that he can stake
  // //await instanceTib.transfer("0xE73c915bCd2f278AACCFfc679B09D4935D328FC6", ethers.utils.parseEther("5000.0"));
  // await instanceTib.transfer(accounts[0], ethers.utils.parseEther("5000.0"));

  // // for debug
  // const amount = 1000;
  // await instanceTib.approve(instanceStaker.address, amount);
  // await instanceStaker.stake(instanceTib.address, amount);

};
