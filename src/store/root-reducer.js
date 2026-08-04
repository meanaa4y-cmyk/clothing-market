import { combineReducers } from '@reduxjs/toolkit';

import { productsReducer } from './products.reducer';
import { ordersReducer } from './orders.reducer';
import { minicartReducer } from './minicart.reducer';

export const rootReducer = combineReducers({
  products: productsReducer,
  orders: ordersReducer,
  minicart: minicartReducer
});
