import React, { Component } from 'react'
import Board from './components/gameboard'
import GameSetup from './components/gamesetup'


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
       showBoard: false,
       botFirst: false
    }

    this.updateProps = this.updateProps.bind(this)
  }

  updateProps(botFirst, showBoard){
    this.setState({
      botFirst,
      showBoard
    })
  }

  render() {
    return (
        <React.Fragment>
          {!this.state.showBoard ?  <GameSetup updateState={this.updateProps}></GameSetup> : null}
          {this.state.showBoard ? <Board updateState={this.updateProps} botFirst={this.state.botFirst} ></Board> : null}
        </React.Fragment>
    )
  }
}
export default App
