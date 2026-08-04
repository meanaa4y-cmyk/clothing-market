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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

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

    try {
      await dispatch(placeOrderThunk(order)).unwrap();
      dispatch(clearCart());
      setFormFields(defaultFormFields);
      setOrderPlaced(true);
    } catch (error) {
      console.error('Failed to place order:', error);
    } finally {
      setIsSubmitting(false);
    }
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
          label={isSubmitting ? 'Placing order…' : 'Place Order'}
          style='gold'
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
};

export default CheckoutForm;
