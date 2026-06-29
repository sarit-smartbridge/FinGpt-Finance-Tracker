import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the FinGPT app shell', () => {
  render(<App />);
  expect(screen.getByRole('link', { name: /FinGPT/i })).toBeInTheDocument();
});
