import React, { Component } from "react";






class UnstakeComp extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  

  }

  componentDidMount = async () => {


  };


  handleClick() 
  {
      this.props.onUnStakeAll();
  }



  render() {
        return (
          <div className="Unstake">
          <button type="button" onClick={() => this.handleClick()}>Unstake All</button>
          </div>
        );
      }

  

}

export default UnstakeComp;