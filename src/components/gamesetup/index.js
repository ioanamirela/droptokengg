import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'

import '../../css/intro.css'
import bb8 from '../../images/bb8.png'

class GameSetup extends Component {

  constructor(props) {
    super(props)

    this.state = {
      roll: false
    }

    this.bb8 = this.bb8.bind(this)

  }

  bb8(){
    this.setState({roll : true})
    setTimeout(() => {
      this.props.updateState(true, true)
    }, 1000)
  }

  render() {

    return (
      <div id="intro">
        <h2>Challenge BB-8 to a game of Drop Token!</h2>
        <div className="content">
          <img src={bb8} alt="BB-8" className={this.state.roll ? 'bb8-lg slide-right' : 'bb8-lg'} />
          <ButtonToolbar>
            <Button variant="danger" onClick={() => this.props.updateState(false, true)}>Go first</Button>
            <Button variant="primary" onClick={this.bb8}>Let BB-8 go first</Button>
          </ButtonToolbar>
        </div>

      </div>
    )
  }
}

export default GameSetup