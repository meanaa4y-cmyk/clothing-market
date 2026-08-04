import { createSelector } from 'reselect';

const productsReducerSelector = (state) => state.products;

export const selectProducts = createSelector(
  [productsReducerSelector],
  (productsSlice) => productsSlice.products
);

export const selectProductsIsLoading = createSelector(
  [productsReducerSelector],
  (productsSlice) => productsSlice.isLoading
);

export const selectProductsIsFallback = createSelector(
  [productsReducerSelector],
  (productsSlice) => productsSlice.isFallback
);

export const selectCategoriesMap = createSelector(
  [selectProducts],
  (products) =>
    products.reduce((acc, product) => {
      const category = (product.category || 'Other').toLowerCase();
      acc[category] = acc[category] || [];
      acc[category].push(product);
      return acc;
    }, {})
);

export const selectCategoryTitles = createSelector(
  [selectCategoriesMap],
  (categoriesMap) => Object.keys(categoriesMap)
);
