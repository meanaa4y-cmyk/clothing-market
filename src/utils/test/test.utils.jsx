import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../store/root-reducer';
import { HashRouter } from 'react-router-dom';

export function renderWithProviders(
  ui,
  {
    preloadState = {},
    store = configureStore({ reducer: rootReducer, preloadedState: preloadState }),
    ...renderOptions
  } = {}
) {
  const Wrapper = ({ children }) => {
    return (
      <Provider store={store}>
        <HashRouter>
          {children}
        </HashRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
