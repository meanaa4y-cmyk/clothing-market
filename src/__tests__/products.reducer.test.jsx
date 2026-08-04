import { expect } from 'vitest';
import { productsReducer, fetchProducts, addProductThunk, deleteProductThunk, PRODUCTS_INITIAL_STATE } from '../store/products.reducer';

describe('Products Reducer tests', () => {
  test('Fetch Loading', () => {
    const expectedState = {
      ...PRODUCTS_INITIAL_STATE,
      isLoading: true
    }

    expect(productsReducer(PRODUCTS_INITIAL_STATE, fetchProducts())).toEqual(expectedState);
  });

  test('Fetch Success', () => {
    const mockData = [
      { id: 1, name: 'Product 1', category: 'mens', price: 10 },
      { id: 2, name: 'Product 2', category: 'womens', price: 20 }
    ]

    const expectedState = {
      ...PRODUCTS_INITIAL_STATE,
      isLoading: false,
      products: mockData,
      isFallback: false
    }

    expect(productsReducer(PRODUCTS_INITIAL_STATE, fetchProducts.fulfilled({ products: mockData, isFallback: false }))).toEqual(expectedState);
  });

  test('Fetch Failed falls back to seeded data', () => {
    const state = productsReducer(PRODUCTS_INITIAL_STATE, fetchProducts.rejected(new Error('boom')));

    expect(state.isLoading).toBe(false);
    expect(state.isFallback).toBe(true);
    expect(state.products.length).toBeGreaterThan(0);
  });

  test('Add product appends to the list', () => {
    const product = { id: 'abc', name: 'New Item', category: 'Hats', price: 15 };
    const state = productsReducer(PRODUCTS_INITIAL_STATE, addProductThunk.fulfilled(product));

    expect(state.products).toHaveLength(1);
    expect(state.products[0].name).toBe('New Item');
  });

  test('Delete product removes it from the list', () => {
    const initial = { ...PRODUCTS_INITIAL_STATE, products: [{ id: 'a' }, { id: 'b' }] };
    const state = productsReducer(initial, deleteProductThunk.fulfilled({ productId: 'a' }));

    expect(state.products.map((p) => p.id)).toEqual(['b']);
  });
});
