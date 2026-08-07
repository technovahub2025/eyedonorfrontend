import { render, screen } from '@testing-library/react';
import App from './App';

test('renders VisionGift branding', () => {
  render(<App />);
  expect(screen.getByText(/VisionGift/i)).toBeInTheDocument();
});
