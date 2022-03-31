import React, { Component } from "react";
import Web3 from "web3";





class StakedComp extends Component {

  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
   
    this.state = {
        TokenAmount: 0
      };
  }

  componentDidMount = async () => {


  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleClick() 
  {
      this.props.onUnStake(this.props.tokenAddress,this.state.TokenAmount);
  }

  render() {

          
        console.log(this.props.tokenAddress);
        console.log(this.props.tokenDecimals);
        console.log(this.props.tokenName);
        console.log(this.props.tokenAmount);
        //const amountInWei =this.props.tokenDecimals;

        // KO
        //Error: Objects are not valid as a React child (found: object with keys {negative, words, length, red}). If you meant to render a collection of children, use an array instead.

        //const amountInWei =Web3.utils.toBN(this.props.tokenAmount);//.div(Web3.utils.toBN(10**this.props.tokenDecimals));
          
            const amountInWei =this.props.tokenAmount;
        return (
          <div className="Staked">
          <p>{this.props.tokenName} {amountInWei} Wei</p>
        
         <form ref="form" onSubmit={this.handleSubmit}>
       
        <label>
          Amount:
          <input
            name="TokenAmount"
            type="number"
            value={this.state.TokenAmount}
            onChange={this.handleInputChange} />
        </label>
        <button type="button" onClick={() => this.handleClick()}>Unstake</button>
      </form>
          </div>
        );
      }

  

}

export default StakedComp;