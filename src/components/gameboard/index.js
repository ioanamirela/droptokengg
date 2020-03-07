import React, { Component } from 'react'
import '../../css/board.css'
import GameService from '../../services/gameService'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'

import bb8 from '../../images/bb8.png'

import { NUM_ROWS, NUM_COLS } from '../../utils/const'


class Board extends Component {

  constructor(props) {
    super(props)

    this.gameService = new GameService()

    this.state = {
      botFirst: props.botFirst,
      player1: 1,
      player2: 2,
      bot: props.botFirst ? 1 : 2,
      currentPlayer: null,
      rows: NUM_ROWS,
      cols: NUM_COLS,
      board: [],
      moves: [],
      gameOver: false,
      invalidMove: false,
      message: ''
    }

    // Bind play function to Board component
    this.play = this.play.bind(this)


  }

  // Initialize board for new game
  async init() {
    // create empty matrix
    let board = []
    for (let r = 0; r < this.state.rows; r++) {
      let row = []
      for (let c = 0; c < this.state.cols; c++) {
        row.push(null)
      }
      board.push(row)
    }

    this.setState({
      board,
      currentPlayer: this.state.player1,
      gameOver: false,
      message: ''
    })

    if (this.state.botFirst){
      let move = await this.botMove()
      await this.play(move)
    }
  }

  togglePlayer() {
    return (this.state.currentPlayer === this.state.player1) ? this.state.player2 : this.state.player1
  }

  async botMove(){
    return await this.gameService.retrieveBotMove(this.state.moves)
  }

  setMessage(player){
    let message = 'It\'s a draw! Try again.'
    if (player > 0){
      message = (player === this.state.bot) ? 'Bot wins this round. Try again!' : 'Congratulations! You won!'
    }
    setTimeout(() => {
      this.setState({ message })
    }, 1000)

  }

  async play(c) {

    await this.setState({
      moves: [...this.state.moves, c],
      invalidMove: false
    })

    if (!this.state.gameOver) {
      // place token on board
      let board = this.state.board
      for (let r = this.state.rows-1; r >= 0; r--) {
        if (!board[r][c]) {
          board[r][c] = this.state.currentPlayer
          break
        }
      }

      // Check status of board
      let result = this.gameService.checkWinCondition(board)
      if (result === this.state.player1) {

        this.setState({ board, gameOver: true })
        this.setMessage(this.state.player1)

      } else if (result === this.state.player2) {

        this.setState({ board, gameOver: true })
        this.setMessage(this.state.player2)

      } else if (result === 0) {

        this.setState({ board, gameOver: true })
        this.setMessage()

      } else {

        // get computer move
        if (this.state.currentPlayer !== this.state.bot){
            let move = await this.botMove()
            if (move < 0){
              // remove last move made
              this.state.moves.pop()
              this.setState({
                invalidMove: true
              })
            } else {
              await this.setState({
                board,
                currentPlayer: this.togglePlayer()
              })
              await this.sleep(500)
              await this.play(move)
            }

        }
      }

      if (this.state.currentPlayer === this.state.bot) {
        this.setState({board, currentPlayer: this.togglePlayer()})
      }

    }
  }

   sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  componentDidMount() {
    this.init()
  }

  render(){
    return (
      <React.Fragment>
          <Modal show={this.state.message !== ''}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header>{this.state.message}</Modal.Header>
            <Modal.Footer>
              <Button variant="success" onClick={() => this.props.updateState(false, false)}>Close</Button>
            </Modal.Footer>
          </Modal>

        <div className="content">
          <h2>Drop Token GG<img src={bb8} alt="BB-8" className="bb8-sm" /></h2>
          <table>
            <thead>
            </thead>
            <tbody>
                {this.state.board.map((row, i) => (<Row key={i} row={row} play={this.play} />))}
            </tbody>
          </table>
        </div>

        <ButtonToolbar>
          <Button variant="success" onClick={() => this.props.updateState(false, false)}>Start over</Button>
        </ButtonToolbar>
        <Alert variant='danger' show={this.state.invalidMove}>
           That column is full. Try another one!
        </Alert>
      </React.Fragment>
    )
  }
}


// Row component
const Row = ({ row, play }) => {
  return (
    <tr>
      {row.map((cell, i) => <Cell key={i} value={cell} columnIndex={i} play={play} />)}
    </tr>
  )
}

const Cell = ({ value, columnIndex, play }) => {
  let color = 'gray'
  if (value === 1) {
    color = 'red'
  } else if (value === 2) {
    color = 'blue'
  }

  return (
    <td>
      <div className="cell" onClick={() => {play(columnIndex)}}>
        <div className={`token ${color}`}></div>
      </div>
    </td>
  )
}

export default Board