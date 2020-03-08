import React, {Component} from "react"

class Cell extends Component {

  render(){
    let color = 'gray'
    if (this.props.value === this.props.player1) {
      color = 'red'
    } else if (this.props.value === this.props.player2) {
      color = 'blue'
    }

    return (
      <td>
        <div className="cell" onClick={() => {this.props.play(this.props.columnIndex)}}>
          <div className={`token ${color}`}></div>
        </div>
      </td>
    )
  }
}

export default Cell