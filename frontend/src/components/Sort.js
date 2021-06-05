import React from "react";
import { config } from "../App";

export class Sort extends React.Component {
  constructor(props) {
    super(props);
    this.videos =[];
    this.state = { filteredvideos : [],};

    // this.handleChange = this.handleChange.bind(this);
  }
  // handleChange(event) {

  //   this.setState({val: event.currentTarget.value}, this.sortBy);
     
  // }

  sortBy = async(sort) => {

    try{
    let res = await( await fetch(`${config.endpoint}?sortBy=${sort}`)).json()
    console.log(res)
    if(res){
      this.setState({filteredvideos: res.videos})
      this.props.handleSort(this.state.filteredvideos)
    }
  }catch(e){

  }
}
  render() {
    return (
      <>
        {"Sort By : "}
        <select className="sort-select" onChange= {e => this.sortBy(e.target.value)} >
          <option value="releaseDate" selected> 
            Release Date
          </option>
          <option  value="viewCount">
            View Count
          </option>
        </select>
      </>
    );
  }
}
