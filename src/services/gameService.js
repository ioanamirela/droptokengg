import {WIN_CONDITION, NUM_ROWS, NUM_COLS, PLAYER1, PLAYER2} from '../utils/const'

class MoveService {

  constructor() {
    this.rowSum= []
    this.colSum= []
    this.diagLeftSum = 0
    this.diagRightSum = 0

    this.initSumArrays()
  }

  /**
   * Initialize arrays that keep track of row and column sums
   */
  initSumArrays(){

       for(let i=0; i<NUM_COLS; i++){
         this.colSum[i] = 0
      }
      for(let i=0; i<NUM_ROWS; i++){
        this.rowSum[i] = 0
      }
    }

  /**
   * Calls 9dt service and retrieves new move
   * @param moves
   * @returns {Promise<any|number>}
   */
    async retrieveBotMove(board, moves) {
      let validMove = null
      while (!validMove) {
        let newMoveR = Math.floor(Math.random() * 4)
        let newMoveC = Math.floor(Math.random() * 4)

        console.log(newMoveR, newMoveC)
        console.log(board[newMoveR][newMoveC])
        if (board[newMoveR] && !board[newMoveR][newMoveC]){
          validMove = newMoveC
        }

      }

      return Promise.resolve(validMove)
    }

  /**
   * Add new move to corresponding sum arrays
   * @param r
   * @param c
   * @param player
   * @returns {Promise<void>}
   */
    async addMove(r, c, player){
      this.colSum[c] += player
      this.rowSum[r] += player

      // diagonal from bottom left to top right: e.g. [0,3], [1,2], [2,1], [3,0]
      if (r + c === NUM_COLS-1) {
        this.diagLeftSum += player
      }

      //diagonal from bottom right to top left: e.g. [0,0], [1,1], [2,2], [3,3]
      if (r === c) {
        this.diagRightSum += player
      }
    }

  /**
   * Check win condition on row, column and diagonals
   * @param movesNo
   * @returns {number|*}
   */
    checkWinCondition(r, c, movesNo) {
        return this.checkColumn(c)
               || this.checkValue(this.diagLeftSum)
               || this.checkValue(this.diagRightSum)
               || this.checkRow(r)
               || this.checkDraw(movesNo)
     }

  /**
   * Check column win condition
   * @returns {number|*}
   */
  checkColumn(c) {
     let val = this.checkValue(this.colSum[c])
     if (val === PLAYER1 || val === PLAYER2)
       return val
   }

  /**
   * Check row win condition
   * @returns {number|*}
   */
  checkRow(r) {
     let val = this.checkValue(this.rowSum[r])
     if (val === PLAYER1 || val === PLAYER2)
       return val
   }

  /**
   *
   * @param value
   * @returns {number}
   */
  checkValue(value){
     let sum = Math.floor(value/WIN_CONDITION)
     let divisible = (value%WIN_CONDITION === 0)

     if (divisible && sum === 1)
       return PLAYER1
     else if (divisible && sum === WIN_CONDITION+1)
       return PLAYER2
   }

  /**
   * Check draw
   * @param movesNo
   * @returns {null|number}
   */
  checkDraw(movesNo) {
     if (movesNo < NUM_ROWS * NUM_COLS)
       return null
     return 0
   }
}

export default MoveService