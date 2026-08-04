import { screen } from '@testing-library/react';
import Admin from '../routes/admin/admin.component';
import CheckoutForm from '../components/checkout-form/checkout-form.component';
import { renderWithProviders } from '../utils/test/test.utils';
import { expect } from 'vitest';

describe('Admin gate tests', () => {
  test('should show the password gate when not authenticated', () => {
    sessionStorage.clear();
    renderWithProviders(<Admin />);

    expect(screen.getByText(/Admin Access/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Admin password/i)).toBeInTheDocument();
  });
});

describe('CheckoutForm tests', () => {
  test('should render checkout form with total', () => {
    renderWithProviders(
      <CheckoutForm
        cartItems={[{ id: 1, name: 'Hoodie', price: 40, quantity: 2, imageUrl: 'x' }]}
        totalPrice={80}
      />
    );

    expect(screen.getByText(/Checkout/i)).toBeInTheDocument();
    expect(screen.getByText('$ 80.00')).toBeInTheDocument();
  });
});
