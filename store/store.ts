import { configureStore, combineReducers } from '@reduxjs/toolkit';
import cvReducer from './features/cv/cvSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import type { CVData } from '@/types/cv';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cv'] // Only persist cv slice
};

export interface RootState {
  cv: CVData;
}

const rootReducer = combineReducers({
  cv: cvReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;