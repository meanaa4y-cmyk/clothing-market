import { screen } from '@testing-library/react';
import Navigation from '../routes/navigation/navigation.component';
import { renderWithProviders } from '../utils/test/test.utils';
import { expect } from 'vitest';

describe('Navigation tests', () => {
  test('It should render Shop All and Admin links', () => {
    renderWithProviders(<Navigation />);

    const shopLink = screen.getByText(/shop all/i);
    expect(shopLink).to.not.toBeNull();

    const adminLink = screen.getAllByText('Admin');
    expect(adminLink.length).toBeGreaterThan(0);
  });

  test('It should NOT render login or logout links', () => {
    renderWithProviders(<Navigation />);

    const loginLink = screen.queryByText(/login/i);
    expect(loginLink).toBeNull();

    const logoutLink = screen.queryByText(/logout/i);
    expect(logoutLink).toBeNull();
  });

});
