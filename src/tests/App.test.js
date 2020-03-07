import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

test('renders board', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Game/i);
  expect(linkElement).toBeInTheDocument();
});
