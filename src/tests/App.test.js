import React from 'react'
import { render } from '@testing-library/react'
import App from '../App'

test('renders player options', () => {
  const { getByText } = render(<App />)
  const element = getByText(/Let BB-8 go first/i)
  expect(element).toBeInTheDocument()
})