import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { placeOrderThunk } from '../../store/orders.reducer';
import { clearCart } from '../../store/minicart.reducer';
import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';
import './checkout-form.styles.scss';

const defaultFormFields = {
  name: '',
  email: '',
  phone: '',
  address: ''
};

const CheckoutForm = ({ cartItems, totalPrice }) => {
  const dispatch = useDispatch();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback((event) => {
    event.preventDefault();

    const order = {
      customer: { ...formFields },
      items: cartItems.map(({ name, price, quantity, imageUrl }) => ({
        name,
        price,
        quantity,
        imageUrl
      })),
      total: totalPrice
    };

    // Show success immediately — order is placed in the background.
    // It'll show up in the Admin panel once it finishes saving.
    dispatch(clearCart());
    setFormFields(defaultFormFields);
    setOrderPlaced(true);

    dispatch(placeOrderThunk(order)).catch((error) => {
      console.error('Failed to place order:', error);
    });
  }, [formFields, cartItems, totalPrice, dispatch]);

  if (orderPlaced) {
    return (
      <div className='checkout-success'>
        <h3>Thank you, your order has been placed!</h3>
        <p>Our team will process it shortly. You can track it in the Admin panel.</p>
      </div>
    );
  }

  return (
    <div className='checkout-form'>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <FormInput
          label='Full Name'
          type='text'
          name='name'
          onChange={handleChange}
          value={formFields.name}
          required
        />
        <FormInput
          label='Email'
          type='email'
          name='email'
          onChange={handleChange}
          value={formFields.email}
          required
        />
        <FormInput
          label='Phone'
          type='tel'
          name='phone'
          onChange={handleChange}
          value={formFields.phone}
          required
        />
        <FormInput
          label='Delivery Address'
          type='text'
          name='address'
          onChange={handleChange}
          value={formFields.address}
          required
        />
        <div className='checkout-total'>
          <span>Total to pay:</span>
          <strong>$ {totalPrice.toFixed(2)}</strong>
        </div>
        <Button
          type='submit'
          label='Place Order'
          style='gold'
        />
      </form>
    </div>
  );
};

export default CheckoutForm;
