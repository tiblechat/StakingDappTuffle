import React, { Component } from "react";






class StakeComp extends Component {

  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
   // this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
        TokenAddress: "",
        TokenAmount: 0
      };
  }

  componentDidMount = async () => {

    console.log("dbgaddress: ",this.props.dbgAddress);
    this.setState({ TokenAddress: this.props.dbgAddress});

  };

  handleClick() 
  {
      this.props.onStake(this.state.TokenAddress,this.state.TokenAmount);
  }


  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault()
  }

  render() {
        return (
          <div className="Stake" style={{border: "1px solid #000000"}}>
          {/* <fieldset style={{width:200}}>
    <legend>Stake</legend> */}
         <form ref="form" onSubmit={this.handleSubmit}>
        <label>
          ERC20 address:
          <input
            name="TokenAddress"
            value={this.state.TokenAddress}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Amount:
          <input
            name="TokenAmount"
            type="number"
            value={this.state.TokenAmount}
            onChange={this.handleInputChange} />
        </label>
        <br />
        {/* <button type="submit">Stake</button> */}
        <button type="button" onClick={() => this.handleClick()}>Stake</button>
      </form>
      {/* </fieldset> */}
          </div>
        );
      }

  

}

export default StakeComp;