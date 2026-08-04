import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
} from '../utils/firebase/firebase.utils';
import SHOP_DATA from '../shop.data';

export const PRODUCTS_INITIAL_STATE = {
  products: [],
  isLoading: true,
  error: null,
  isFallback: false
};

const seedProductsFromData = () =>
  SHOP_DATA.flatMap((category) =>
    category.items.map((item) => ({
      ...item,
      category: category.title,
      description: ''
    }))
  );

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    try {
      const products = await getProducts();
      return { products, isFallback: false };
    } catch (error) {
      return { products: seedProductsFromData(), isFallback: true };
    }
  }
);

export const addProductThunk = createAsyncThunk(
  'products/addProduct',
  async (product) => {
    try {
      return await addProduct(product);
    } catch (error) {
      return { id: `local-${Date.now()}`, ...product };
    }
  }
);

export const updateProductThunk = createAsyncThunk(
  'products/updateProduct',
  async ({ productId, updates }) => {
    try {
      await updateProduct(productId, updates);
    } catch (error) {
      // keep going, update local state anyway
    }
    return { productId, updates };
  }
);

export const deleteProductThunk = createAsyncThunk(
  'products/deleteProduct',
  async (productId) => {
    try {
      await deleteProduct(productId);
    } catch (error) {
      // keep going, remove locally anyway
    }
    return { productId };
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: PRODUCTS_INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.isFallback = action.payload.isFallback;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.products = seedProductsFromData();
        state.isFallback = true;
        state.error = action.error.message;
      })
      .addCase(addProductThunk.fulfilled, (state, action) => {
        state.products = [action.payload, ...state.products];
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        const { productId, updates } = action.payload;
        state.products = state.products.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        );
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        const { productId } = action.payload;
        state.products = state.products.filter(
          (product) => product.id !== productId
        );
      });
  }
});

export const productsReducer = productsSlice.reducer;
