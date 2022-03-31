import React, { Component } from "react";






class ClaimComp extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
   

  }

  componentDidMount = async () => {


  };

  handleClick() 
  {
      this.props.onClaim();
  }


  render() {
        return (
          <div className="Claim">
          <h2>{this.props.RewardsAmountEstimated}</h2>
          <button type="button" onClick={() => this.handleClick()}>Claim</button>
          </div>
        );
      }

  

}

export default ClaimComp;