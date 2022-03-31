import React, { Component } from "react";

import StakeComp from "./StakeComp"
import StakedList from "./StakedListComp"
import UnstakeComp from "./UnstakeComp"
import ClaimComp from "./ClaimComp"

import Staker from "../contracts/Staker.json";
import getWeb3 from "../getWeb3";

import erc20 from "../contracts/ERC20.json"
import Web3 from "web3";


// for debug
import MyTokenToBeStaked from "../contracts/MyTokenToBeStaked.json";

class MainComp extends Component {

    constructor(props) {
        super(props);


        const fakeinput = [];//[{ "name": "test1", "amount": 100 }, { "name": "test2", "amount": 500 }];
        const fakereward = 0;//42;
        this.state = {
            web3: null,
            accounts: null,
            contract: null,
            stakedlist: fakeinput,
            estimatedReward: fakereward,
            netId:0
           

        };

        this.runInit = this.runInit.bind(this);
    }

    

    componentDidMount = async () => {
        console.log("hello hello");
        try {
            console.log("hello hello 2");
            // Get network provider and web3 instance.
            const theweb3 = await getWeb3();
            //const theweb3 = this.props.theweb3;
            console.log("hello hello 3");
            console.log(theweb3);
            // Use web3 to get the user's accounts.
            const theaccounts = await theweb3.eth.getAccounts();
            console.log(theaccounts[0]);
            // Get the contract instance.
            const networkId = await theweb3.eth.net.getId();
            const deployedNetwork = Staker.networks[networkId];
            const instance = new theweb3.eth.Contract(
                Staker.abi,
                deployedNetwork && deployedNetwork.address,
            );

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({ web3: theweb3, accounts: theaccounts, contract: instance,netId:networkId }, this.runInit);

            // EVENTS
            let options = {
                filter: {
                    value: [],
                },
                fromBlock: 0
            };

 
            console.log("registering events"); 
            instance.events.StakeEvent(options).on('data', event =>  this.runInit());
            instance.events.UnStakeEvent(options).on('data', event =>  this.runInit());
            instance.events.ClaimEvent(options).on('data', event =>  this.runInit());

 


             // call method every 10 s
            this.interval = setInterval(this.updateEstimatedReward, 10000);

        } 
        catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    componentWillUnmount() {
        // Clear the interval right before component unmount
        clearInterval(this.interval);
    }
    

    updateEstimatedReward = async() => 
    {
        const { accounts, contract } = this.state;
        if (accounts != null)
        {
            const result = await contract.methods.estimateRewardsForUser(accounts[0]).call();
            // KO
            //const rewards = Web3.utils.toBN(result[0]).div(Web3.utils.toBN(10**18));
            
            const rewards = result;

            this.setState({estimatedReward:rewards });
        }
        console.log("update estimated rewards");
    }
    runInit = async () => {
        const { accounts, contract } = this.state;
        // récupérer la liste montants stakés
        const tokenlist = await contract.methods.GetUserBalances(accounts[0]).call();
        console.log(tokenlist);



        // recup estimation rewards

        const rewards =await contract.methods.estimateRewardsForUser(accounts[0]).call();

   
        this.setState({ stakedlist: tokenlist,estimatedReward:rewards });
 

       
    };


    // **************** callbacks
    ClaimTransaction = async () => {
        console.log("Claim Called");
        
        const accounts = this.state.accounts;
        
        const contract = this.state.contract;
        console.log(accounts[0]);
        console.log(contract);
        try {
            await contract.methods.claimRewards().send({ from: accounts[0] });
            // Récupérer la liste des comptes autorisés
            this.runInit();
        }
        catch (error) {
            console.log("ca marche pas");
            console.log(error);
        }
    }

    StakeTransaction = async (address, amount) => {
        console.log("Stake Called " + address + " " + amount);

        
        const accounts = this.state.accounts;
        
        const contract = this.state.contract;
        console.log(accounts[0]);
        console.log(contract);
        try {

            // authorize
            const theweb3 = this.state.web3;
            const networkId = this.state.netId;
            const deployedNetwork = Staker.networks[networkId];
            const instanceErc20 = new theweb3.eth.Contract(
                erc20.abi,
                deployedNetwork && address,
            );

            const decimalzzz = await instanceErc20.methods.decimals().call();
            // amount in wei
            
            console.log( decimalzzz);
            const amountInWei = Web3.utils.toBN(amount).mul(Web3.utils.toBN(10**decimalzzz));
            
            
            console.log( accounts[0]);
            console.log( contract);
            const allowance = await instanceErc20.methods.allowance( accounts[0] ,contract.options.address).call();
            console.log(allowance);
            await instanceErc20.methods.approve(contract.options.address, amountInWei).send({ from: accounts[0] });

    

            //const amountInWei = Web3.utils.toBN(amount);//.mul(Web3.utils.toBN(10**decimalzzz));

         
            // stake
            await contract.methods.stake(address, amountInWei).send({ from: accounts[0] });
            // Récupérer la liste des comptes autorisés
            this.runInit();
        }
        catch (error) {
            console.log("ca marche pas");
            console.log(error);
        }
    }



    UnStakeAllTransaction = async () => {
        console.log("Unstake All Called");
        const accounts = this.state.accounts;
        
        const contract = this.state.contract;

        try {
            await contract.methods.unstakeAll().send({ from: accounts[0] });
            // Récupérer la liste des comptes autorisés
            this.runInit();
        }
        catch (error) {
            console.log("ca marche pas");
            console.log(error);
        }
    }


    UnStakeTransaction = async (address, amount) => {
        console.log("Unstake Called " + address + " " + amount);
        const accounts = this.state.accounts;
        
        const contract = this.state.contract;
        console.log(accounts[0]);
        console.log(contract);
        try {


            const theweb3 = this.state.web3;
            const networkId = this.state.netId;
            const deployedNetwork = Staker.networks[networkId];
            const instanceErc20 = new theweb3.eth.Contract(
                erc20.abi,
                deployedNetwork && address,
            );
        
            const decimalzzz = await instanceErc20.methods.decimals().call();
            // amount in wei
            
            console.log( decimalzzz);
            const amountInWei = Web3.utils.toBN(amount).mul(Web3.utils.toBN(10**decimalzzz));



            // stake
            await contract.methods.unstake(address, amountInWei).send({ from: accounts[0] });
            // Récupérer la liste des comptes autorisés
            this.runInit();
        }
        catch (error) {
            console.log("ca marche pas");
            console.log(error);
        }
    }


    render() {

        const networkId = this.state.netId;
        const deployedNetwork = MyTokenToBeStaked.networks[networkId];

        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
          }
        return (
            <div className="MainComp">
                <h1>Staking dapp</h1>
                <p>Stake any ERC20 to earn yield.</p>
                <StakeComp onStake={this.StakeTransaction} dbgAddress ={deployedNetwork.address} ></StakeComp>
                <br></br>
                <StakedList thelist={this.state.stakedlist} onUnStake={this.UnStakeTransaction}></StakedList>
                <br></br>
                <UnstakeComp onUnStakeAll={this.UnStakeAllTransaction}></UnstakeComp>
                <br></br>
                <ClaimComp RewardsAmountEstimated={this.state.estimatedReward} onClaim={this.ClaimTransaction}></ClaimComp>
            </div>
        );
    }



}

export default MainComp;