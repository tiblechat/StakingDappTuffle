import React, { Component } from "react";



import StakedComp from "./StakedComp"


class StakedListComp extends Component {

  constructor(props) {
    super(props);
   

  }

  componentDidMount = async () => {


  };




  render() {


        // const data =[{"name":"test1"},{"name":"test2"}];
        // const listItems = data.map((d) => <li key={d.name}>{d.name}</li>);

        
        var listItems = this.props.thelist.map((d) => <li key={d.tokenName}>{<StakedComp onUnStake = {this.props.onUnStake} tokenName = {d.tokenName} tokenAmount = {d.tokenAmount} tokenAddress = {d.tokenAddress} tokenDecimals = {d.decimals}></StakedComp>}</li>);
      

        // var listItems = <li key={this.props.thelist[0][0]}>{<StakedComp onUnStake = {this.props.onUnStake} tokenName = {this.props.thelist[0][0]} tokenAmount = {this.props.thelist[0][2]} tokenAddress = {this.props.thelist[0][1]} tokenDecimals = {this.props.thelist[0][3]}></StakedComp>}</li>;

    // var listItems = [];
    // for (var i = 0; i < this.props.thelist; i++) {
    //   var d = this.props.thelist[i];
    //   listItems.push(<li key={d[0]}>{<StakedComp onUnStake = {this.props.onUnStake} tokenName = {d[0]} tokenAmount = {d[2]} tokenAddress = {d[1]} tokenDecimals = {d[3]}></StakedComp>}</li>);
    // }
    

        return (
        //   <div className="StakedListComp" style={{border: "1px solid #000000"}}>
        //     <StakedComp tokenName = "TIB" tokenAmount = {1000} ></StakedComp>
        //     <StakedComp tokenName = "UNI" tokenAmount = {5000}></StakedComp>
        //   </div>

        <div className="StakedListComp" style={{border: "1px solid #000000"}}>
        {listItems }
      </div>


        );
      }

  

}

export default StakedListComp;