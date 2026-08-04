import { expect } from 'vitest';
import { selectProducts, selectProductsIsLoading, selectCategoriesMap } from '../store/products.selector';

const mockState = {
  products: {
    isLoading: false,
    products: [
      { id: 1, name: 'Product 1', category: 'mens' },
      { id: 2, name: 'Product 2', category: 'mens' },
      { id: 3, name: 'Product 3', category: 'womens' }
    ]
  }
}

describe('Products Selectors Test', () => {

  test('selectProducts should return products data', () => {
    expect(selectProducts(mockState)).toEqual(mockState.products.products)
  });

  test('selectProductsIsLoading should return isLoading state', () => {
    expect(selectProductsIsLoading(mockState)).toBe(false);
  });

  test('selectCategoriesMap should group products by category', () => {
    const expectedMap = {
      mens: [
        { id: 1, name: 'Product 1', category: 'mens' },
        { id: 2, name: 'Product 2', category: 'mens' }
      ],
      womens: [
        { id: 3, name: 'Product 3', category: 'womens' }
      ]
    }

    expect(selectCategoriesMap(mockState)).toEqual(expectedMap)
  });

});
