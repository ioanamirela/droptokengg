import React, {Component} from "react"
import Cell from './cell'

class Row extends Component {

  render(){
    return (
      <tr>
        {this.props.row.map((cell, i) => <Cell key={i} value={cell} columnIndex={i} play={this.props.play} disabled={this.props.disabled} />)}
      </tr>
    )
  }
}

export default Row