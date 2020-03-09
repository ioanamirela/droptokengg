import React from 'react'
import { render } from '@testing-library/react'
import { act } from "react-dom/test-utils"
import App from '../App'
import Board from '../components/gameboard/index'

test('renders player options', () => {
  const { getByText } = render(<App />)
  const element = getByText(/Let BB-8 go first/i)
  expect(element).toBeInTheDocument()
})

test("it shows the board", () => {
  act(() => {
    render(<Board />)
  })
})
