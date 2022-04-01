pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT



// chainlink
import "@chainlink/contracts/src/v0.8/interfaces/FeedRegistryInterface.sol";
import "@chainlink/contracts/src/v0.8/Denominations.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/access/Ownable.sol";




contract Staker is Ownable {



  struct TokenBalance
  {
      uint balance;
      bool isInList;
  }

  struct StakedToken
  {
      string tokenName;
      address tokenAddress;
      uint256 tokenAmount;
      uint256 decimals;
  }

  event StakeEvent(address sender, address token,uint256 amount);
  event UnStakeEvent(address sender, address token,uint256 amount);
  event ClaimEvent(address sender, uint256 amount);

  // for each user, balances in each token
  mapping (address => mapping (address => TokenBalance)) public balances;
  mapping (address => uint256) public rewards;
  mapping (address => uint256) public rewardsTimings;
  mapping(address => address[]) public tokens;


  uint public dbgvar1;
  uint public dbgvar2;
  uint public dbgvar3;
  uint public dbgvar4;
  uint public dbgvar5;
  uint public dbgvar6;
  uint public dbgvar7;
  uint public dbgvar8;

  // ownership should be tranfered to contract so that it can mint
  ERC20PresetMinterPauser rewToken;
  
  // chainlink
  FeedRegistryInterface internal registry;
  

  constructor(address _registry)
  {
      // our reward token
      //rewToken = ERC20PresetMinterPauser(RewTokenAddress);
      // chainlink registry
      // TESTCHAIN
      registry = FeedRegistryInterface(_registry);
  }
  
  function setRewardToken(address RewTokenAddress) public onlyOwner
  {
    rewToken = ERC20PresetMinterPauser(RewTokenAddress);
  }


function GetUserBalances(address user) public view returns (StakedToken[] memory)
{
    uint Tokencount = tokens[user].length;
    if (Tokencount > 0)
    {
        StakedToken[] memory tokensTMP = new StakedToken[](Tokencount);
        for (uint i = 0; i < Tokencount; i++) {
            StakedToken memory st;
            address tokenAddress = tokens[user][i];

            st.tokenAddress = tokenAddress;
            st.tokenAmount = balances[user][tokenAddress].balance;
            st.tokenName = ERC20(tokenAddress).name();
            st.decimals = uint256(ERC20(tokenAddress).decimals());
            tokensTMP[i] = st; 

        }
        return (tokensTMP);
    }
    else
    {
        StakedToken[] memory tokensTMPEmpty;
        return (tokensTMPEmpty);
    }
   
  }

 

  function getPrice(address base, address quote) public view returns (int) 
  {
           // TESTCHAIN
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = registry.latestRoundData(base, quote);
        return price;
        //return 1475969518;
    }

  // staking d'erc20
  // should I implement stake(IERC20)?
  function stake(address myERC20address,uint256 amount) public 
  {
    require(amount > 0,"staked amount should be positive");

    // our contract has to be approved by the user for this erc20
    IERC20 token = IERC20(myERC20address);
    require(token.allowance(msg.sender, address(this)) >= amount,"Token allowance too low");

    uint userBalance = token.balanceOf(msg.sender);
    require(userBalance >= amount,"Token balance too low");


    // update rewards based on current token balances before adding
    updateRewardsForUser(msg.sender);




    // store balance
    // overflow risk here?

    // check if token is already in our list
    if (!balances[msg.sender][myERC20address].isInList)
    {
        balances[msg.sender][myERC20address].isInList = true;
        tokens[msg.sender].push(myERC20address);  

    }
    balances[msg.sender][myERC20address].balance += amount;

    // send erc20 to contract
    _safeTransferFrom(token, msg.sender, address(this), amount);
    emit StakeEvent(msg.sender,myERC20address,amount);




  }


  function unstake(address myERC20address,uint256 amount) public 
  {
      require(amount > 0,"unstaked amount should be positive");
      require(balances[msg.sender][myERC20address].balance - amount >= 0,"balance should be > amount to be unstaked");

      // update rewards based on current token balances before removing
      updateRewardsForUser(msg.sender);


      // our contract has to be approved by the user for this erc20
      IERC20 token = IERC20(myERC20address);
      // store balance
      // overflow risk here?
      balances[msg.sender][myERC20address].balance -= amount;
      // send erc20 back
      bool sent = token.transfer(msg.sender, amount);
      require(sent, "Token transfer failed");
      emit UnStakeEvent(msg.sender,myERC20address,amount);

      // TODO: retirer le token de tokens? si la balance est vide?, possible?, intéressant?
  }


  function unstakeAll() public 
  {
    // update rewards based on current token balances before removing
    updateRewardsForUser(msg.sender);
    uint Tokencount = tokens[msg.sender].length;
    if (Tokencount > 0)
    {
       
        for (uint i = 0; i < Tokencount; i++) {
           
            address tokenAddress = tokens[msg.sender][i];
            uint amount = balances[msg.sender][tokenAddress].balance;
            IERC20 token = IERC20(tokenAddress);
            balances[msg.sender][tokenAddress].balance -= amount;
            // send erc20 back
            bool sent = token.transfer(msg.sender, amount);
            require(sent, "Token transfer failed");
            emit UnStakeEvent(msg.sender,tokenAddress,amount);
        }
        claimRewards();
    }
  }

  function unstakeAndClaim(address myERC20address,uint256 amount) public 
  {
      require(amount > 0,"unstaked amount should be positive");
      require((balances[msg.sender][myERC20address].balance - amount) >= 0,"balance should be > amount to be unstaked");

      // update rewards based on current token balances before removing
      updateRewardsForUser(msg.sender);


      // our contract has to be approved by the user for this erc20
      IERC20 token = IERC20(myERC20address);
      // store balance
      // overflow risk here?
      balances[msg.sender][myERC20address].balance -= amount;
      // send erc20 back
      bool sent = token.transfer(msg.sender, amount);
      require(sent, "Token transfer failed");
      emit UnStakeEvent(msg.sender,myERC20address,amount);

      claimRewards();
  }

  function estimateRewardsForUser(address user) public view returns (uint256)
  {
      uint rewardTotalInToken;
      bool notFirstTime;
      (rewardTotalInToken,notFirstTime) = estimateNewRewardsForUser(user);

      return (rewards[user] + rewardTotalInToken);
  }


  function estimateNewRewardsForUser(address user) internal view returns (uint256,bool)
  {
    
       // get current time
      uint current = block.timestamp;

      // get last current time
      uint last = rewardsTimings[user];

   

    if (last > 0)
    {
      // compute delta
      uint delta =current - last;

      uint rewardTotalInToken = 0;
      // for each token, with a > 0 balance, compute reward

      // TODO: unbounded loop is dangerous --> voir le defi votingapp ou les bons patterns
      // WARN: This unbounded for loop is an anti-pattern
      for (uint i=0; i<tokens[user].length; i++) 
      {

        
          address tokenAddress = tokens[user][i];



        // ************************************* ONESHOT FOR BETTER ROUNDING

        uint tokenBalance = balances[user][tokenAddress].balance;
        // DBG
       // rewardTotalInToken += tokenBalance;
// ok here
          uint8 decimalsStaked = ERC20(tokenAddress).decimals();

          // TODO: compute price with chainlink
          uint priceFromPriceFeed = uint(getPrice(tokenAddress,Denominations.USD));//1475969518;// link price from chainlink and aggregator

          // DBG
        //rewardTotalInToken += priceFromPriceFeed;
// ok here

          // TESTCHAIN
         // uint8 decimals = 8;//registry.decimals(tokenAddress,Denominations.USD);//
          
           uint8 decimals = registry.decimals(tokenAddress,Denominations.USD);//
          // TODO: le calcul qui suit pourait être fait en dehors de la buocle une fois qu'on connaît la valeur totale stakée en USD

          // n% APY (APR?)
          uint n = 50;// 50% APY


          // on recompense de 1 token par USD staké
          uint8 decimalsRew = rewToken.decimals();
          uint tokenRewardValUSD = 1 * 10**decimalsRew; 

          // TODO on force à 10 s pour valider
        //   delta = 10;
        //   // TODO prix forcé à 1400000000
        //   priceFromPriceFeed = 1400000000;

          // TODO: if this compute could be done at the end of the lopp we could have less rounding errors
          uint nbTokenReward = tokenRewardValUSD*delta*tokenBalance*priceFromPriceFeed*n /(365*24*3600*100*10**decimals*10**decimalsStaked);
     
          rewardTotalInToken += nbTokenReward;
        
      }
      return (rewardTotalInToken,true);
    }
    else
    {
       return (0,false);
    }
  }

  function updateRewardsForUser(address user) public
  {
      uint rewardTotalInToken;
      bool notFirstTime;
      (rewardTotalInToken,notFirstTime) = estimateNewRewardsForUser(user);
      if (notFirstTime)
      {
        // only update timestamp and rewards if > 0 because we may not have rewards due to integer roundings
        // in that case we need to keep our timestamp not to lose anything
        if (rewardTotalInToken > 0)
        {
            rewards[user] += rewardTotalInToken;
            rewardsTimings[user] = block.timestamp;
        }
      }
      else
      {
          rewardsTimings[user] = block.timestamp;
      }
  }

  function claimRewards() public 
  {
      updateRewardsForUser(msg.sender);
      if (rewards[msg.sender] > 0)
      {
          uint amount = rewards[msg.sender];
          rewards[msg.sender] = 0;
          rewardsTimings[msg.sender] = block.timestamp;
          //rewToken._mint(msg.sender, rewards[msg.sender] * 10**uint(decimals()));
          rewToken.mint(msg.sender, amount);
          emit ClaimEvent(msg.sender,amount);
      }

  }



  function _safeTransferFrom(
        IERC20 token,
        address sender,
        address recipient,
        uint amount
    ) private {
        bool sent = token.transferFrom(sender, recipient, amount);
        require(sent, "Token transfer failed");
    }

}
