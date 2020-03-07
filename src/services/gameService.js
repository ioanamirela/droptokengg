import { WIN_CONDITION, BASE_URL } from '../utils/const'

class MoveService {

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

    checkWinCondition(board) {
        return this.checkColumn(board)
               || this.checkDiagonalRight(board)
               || this.checkDiagonalLeft(board)
               || this.checkRow(board)
               || this.checkDraw(board)
     }

     checkColumn(board) {
         for (let r = WIN_CONDITION-1; r < board.length; r++) {
           for (let c = 0; c < board[0].length; c++) {
             if (board[r][c]) {
               if (board[r][c] === board[r - 1][c] &&
                   board[r][c] === board[r - 2][c] &&
                   board[r][c] === board[r - 3][c]) {
                 return board[r][c]
               }
             }
           }
         }
       }

       checkRow(board) {
         for (let r = 0; r < board.length; r++) {
           for (let c = 0; c < WIN_CONDITION; c++) {
             if (board[r][c]) {
               if (board[r][c] === board[r][c + 1] &&
                   board[r][c] === board[r][c + 2] &&
                   board[r][c] === board[r][c + 3]) {
                 return board[r][c]
               }
             }
           }
         }
       }

       checkDiagonalRight(board) {
         for (let r = WIN_CONDITION-1; r < board.length; r++) {
           for (let c = 0; c < WIN_CONDITION; c++) {
             if (board[r][c]) {
               if (board[r][c] === board[r - 1][c + 1] &&
                   board[r][c] === board[r - 2][c + 2] &&
                   board[r][c] === board[r - 3][c + 3]) {
                 return board[r][c]
               }
             }
           }
         }
       }

       checkDiagonalLeft(board) {
         for (let r = WIN_CONDITION-1; r < board.length; r++) {
           for (let c = WIN_CONDITION-1; c < board[0].length; c++) {
             if (board[r][c]) {
               if (board[r][c] === board[r - 1][c - 1] &&
                   board[r][c] === board[r - 2][c - 2] &&
                   board[r][c] === board[r - 3][c - 3]) {
                 return board[r][c]
               }
             }
           }
         }
       }

       checkDraw(board) {
         for (let r = 0; r < board.length; r++) {
           for (let c = 0; c < board[0].length; c++) {
             if (board[r][c] === null) {
               return null
             }
           }
         }

         return 0
       }
}

export default MoveService