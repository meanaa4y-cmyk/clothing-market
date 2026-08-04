import { configureStore } from "@reduxjs/toolkit";
import logger from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { rootReducer } from './root-reducer';

const middleWares = [import.meta.env.DEV && logger].filter(Boolean);

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['products', 'orders']
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }).concat(middleWares)
});

export const persistor = persistStore(store);
