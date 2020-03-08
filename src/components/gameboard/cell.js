import React, {Component} from "react"
import { PLAYER1, PLAYER2 } from '../../utils/const'

class Cell extends Component {

  render(){
    let color = 'gray'
    if (this.props.value === PLAYER1) {
      color = 'red'
    } else if (this.props.value === PLAYER2) {
      color = 'blue'
    }

    return (
      <td>
        <div className="cell" onClick={() => {this.props.play(this.props.columnIndex)}}>
          <div className="token"><div className={`${color}`}></div> </div>
        </div>
      </td>
    )
  }
}

export default Cell