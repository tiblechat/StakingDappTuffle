
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.0.0/contracts/token/ERC20/ERC20.sol";

//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";



contract RewardToken is ERC20PresetMinterPauser {
    constructor(string memory name, string memory symbol,address minter) ERC20PresetMinterPauser(name, symbol) {
        // Mint 100 tokens to msg.sender
        // Similar to how
        // 1 dollar = 100 cents
        // 1 token = 1 * (10 ** decimals)
        // _mint(msg.sender, 100 * 10**uint(decimals()));
        grantRole(MINTER_ROLE, minter);
        grantRole(DEFAULT_ADMIN_ROLE, minter);
        grantRole(PAUSER_ROLE, minter);
    }
} 