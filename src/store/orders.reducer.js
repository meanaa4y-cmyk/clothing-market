import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getOrders,
  addOrder,
  updateOrderStatus,
  deleteOrder
} from '../utils/firebase/firebase.utils';

export const ORDERS_INITIAL_STATE = {
  orders: [],
  isLoading: true,
  error: null,
  isFallback: false
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  try {
    const orders = await getOrders();
    return { orders, isFallback: false };
  } catch (error) {
    return { orders: [], isFallback: true };
  }
});

export const placeOrderThunk = createAsyncThunk(
  'orders/placeOrder',
  async (order) => {
    try {
      return await addOrder(order);
    } catch (error) {
      return {
        id: `local-${Date.now()}`,
        ...order,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
    }
  }
);

export const updateOrderStatusThunk = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }) => {
    try {
      await updateOrderStatus(orderId, status);
    } catch (error) {
      // keep going, update local state anyway
    }
    return { orderId, status };
  }
);

export const deleteOrderThunk = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId) => {
    try {
      await deleteOrder(orderId);
    } catch (error) {
      // keep going, remove locally anyway
    }
    return { orderId };
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: ORDERS_INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.isFallback = action.payload.isFallback;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.orders = [];
        state.error = action.error.message;
      })
      .addCase(placeOrderThunk.fulfilled, (state, action) => {
        state.orders = [action.payload, ...state.orders];
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;
        state.orders = state.orders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        );
      })
      .addCase(deleteOrderThunk.fulfilled, (state, action) => {
        const { orderId } = action.payload;
        state.orders = state.orders.filter((order) => order.id !== orderId);
      });
  }
});

export const ordersReducer = ordersSlice.reducer;
