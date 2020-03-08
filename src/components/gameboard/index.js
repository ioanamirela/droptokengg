import React, { Component } from 'react'
import '../../css/board.css'
import GameService from '../../services/gameService'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'

import Row from './row'
import bb8 from '../../images/bb8.png'

import { NUM_ROWS, NUM_COLS, PLAYER1, PLAYER2 } from '../../utils/const'

class Board extends Component {

  constructor(props) {
    super(props)

    this.state = {
      botFirst: props.botFirst,
      bot: props.botFirst ? PLAYER1 : PLAYER2,
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

    this.gameService = new GameService()
  }

  /**
   * Initialize board for new game
   * @returns {Promise<void>}
   */
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
      currentPlayer: PLAYER1,
      gameOver: false,
      message: ''
    })

    if (this.state.botFirst){
      let move = await this.botMove()
      await this.play(move)
    }
  }

  /**
   * Switch current player
   * @returns {*}
   */
  switchPlayer() {
    return (this.state.currentPlayer === PLAYER1) ? PLAYER2 : PLAYER1
  }

  /**
   * Get bot move from service
   * @returns {Promise<any|number>}
   */
  async botMove(){
    return await this.gameService.retrieveBotMove(this.state.moves)
  }

  /**
   * Update state with message for player
   * @param player
   */
  setMessage(player){
    let message = 'It\'s a draw! Try again.'
    if (player > 0){
      message = (player === this.state.bot) ? 'BB-8 wins this round. Try again!' : 'Congratulations! You won!'
    }
    setTimeout(() => {
      this.setState({ message })
    }, 1000)

  }

  /**
   * Adds new move to board or
   * @param c
   */
   async handleNewMove(c){
    let addedMove = false
    let board = this.state.board
    for (let r = this.state.rows - 1; r >= 0; r--) {
      if (!board[r][c]) {
        board[r][c] = this.state.currentPlayer
        // update corresponding sum arrays
        this.gameService.addMove(r, c, this.state.currentPlayer)
        addedMove = true
        break
      }
    }
    if (!addedMove) {
      this.setState({
        board,
        invalidMove: true
      })
    } else {
      this.setState({
        board,
        moves: [...this.state.moves, c],
        invalidMove: false
      })
    }
  }

  /**
   * Play game
   * @param c
   * @returns {Promise<void>}
   */
  async play(c) {

    if (!this.state.gameOver) {
      // Add move to board
      await this.handleNewMove(c)
      if (this.state.invalidMove)
        return

      // Check status of board
      let result = this.gameService.checkWinCondition(this.state.moves.length)
      if (result != null){
        this.setState({ gameOver: true })
        this.setMessage(result)
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
              this.setState({
                currentPlayer: this.switchPlayer()
              })
              // make it seem like BB-8 is taking some time to think
              await this.sleep(500)
              await this.play(move)
            }

        }
      }

      if (this.state.currentPlayer === this.state.bot) {
        this.setState({currentPlayer: this.switchPlayer()})
      }

    }
  }

  /**
   * Sleep for ms time
   * @param ms
   * @returns {Promise<unknown>}
   */
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
              <Button variant="success" onClick={() => this.props.updateState(false, false)}>Play!</Button>
            </Modal.Footer>
          </Modal>

        <div className="content">
          <h2>Drop Token GG<img src={bb8} alt="BB-8" className="bb8-sm" /></h2>

          <table>
            <tbody>
                {this.state.board.map((row, i) => (<Row key={i} row={row} play={this.play}  />))}
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


export default Board