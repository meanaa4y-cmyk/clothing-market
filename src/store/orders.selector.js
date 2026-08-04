import { createSelector } from 'reselect';

const ordersReducerSelector = (state) => state.orders;

export const selectOrders = createSelector(
  [ordersReducerSelector],
  (ordersSlice) => ordersSlice.orders
);

export const selectOrdersIsLoading = createSelector(
  [ordersReducerSelector],
  (ordersSlice) => ordersSlice.isLoading
);

export const selectOrdersIsFallback = createSelector(
  [ordersReducerSelector],
  (ordersSlice) => ordersSlice.isFallback
);
