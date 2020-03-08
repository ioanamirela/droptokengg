import {WIN_CONDITION, BASE_URL, NUM_ROWS, NUM_COLS} from '../utils/const'

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
    async retrieveBotMove(moves) {
      try {
        let url = BASE_URL + `?moves=[${moves}]`
        let response = await fetch(url)
        let data = await response.json()

        if (!response.ok) {
          // invalid set of moves
          let error = (data && data.message) || response.statusText
          throw new Error(error)
        }

        //new move will be last element in response array
        return data[data.length - 1]
      } catch(e) {
        console.log(e)
        return -1
      }
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

      // diagonal from bottom left to top right: [0,3], [1,2], [2,1], [3,0]
      if (r + c === NUM_COLS-1) {
        this.diagLeftSum += player
      }

      //diagonal from bottom right to top left: [0,0], [1,1], [2,2], [3,3]
      if (r === c) {
        this.diagRightSum += player
      }
    }

  /**
   * Check win condition on row, column and diagonals
   * @param movesNo
   * @returns {number|*}
   */
    checkWinCondition(movesNo) {
        return this.checkColumn()
               || this.checkValue(this.diagLeftSum)
               || this.checkValue(this.diagRightSum)
               || this.checkRow()
               || this.checkDraw(movesNo)
     }

  /**
   * Check column win condition
   * @returns {number|*}
   */
  checkColumn() {
     for (let c = 0; c < NUM_COLS; c++){
       let val = this.checkValue(this.colSum[c])
       if (val === 1 || val === WIN_CONDITION+1)
         return val
     }
   }

  /**
   * Check row win condition
   * @returns {number|*}
   */
  checkRow() {
     for (let r = 0; r < NUM_ROWS; r++) {
       let val = this.checkValue(this.rowSum[r])
       if (val === 1 || val === WIN_CONDITION+1)
         return val
     }
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
       return 1
     else if (divisible && sum === WIN_CONDITION+1)
       return WIN_CONDITION+1
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