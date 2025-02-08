import { configureStore, combineReducers } from '@reduxjs/toolkit';
import cvReducer from './features/cv/cvSlice';
import { persistStore, persistReducer, createMigrate, PersistedState, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, Storage } from 'redux-persist';
import type { CVData } from '@/types/cv';

// Create a noop storage for SSR
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    }
  };
};

// Initial state that matches the CVData type
const emptyInitialState: CVData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
  },
  education: [],
  experience: [],
  skills: [],
  languages: [],
  certifications: [],
  interests: []
};

const createPersistConfig = (storage: Storage) => ({
  key: 'root',
  storage,
  whitelist: ['cv'],
  version: 1,
  migrate: createMigrate({
    1: () => {
      // Always return empty state to ensure Clerk data takes precedence
      return {
        cv: emptyInitialState,
        _persist: {
          version: 1,
          rehydrated: true
        }
      } as PersistedState
    }
  }, { debug: false }),
  timeout: 2000
});

export interface RootState {
  cv: CVData;
}

const rootReducer = combineReducers({
  cv: cvReducer,
});

// Get the appropriate storage based on environment
const getStorage = () => {
  if (typeof window !== 'undefined') {
    return import('redux-persist/lib/storage').then(module => module.default);
  }
  return Promise.resolve(createNoopStorage());
};

// Create store with the appropriate storage
const createStore = async () => {
  const storage = await getStorage();
  const persistConfig = createPersistConfig(storage);
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
      }),
  });

  const persistor = persistStore(store);

  return { store, persistor };
};

// Create store synchronously for SSR
const createStoreSync = () => {
  const storage = createNoopStorage();
  const persistConfig = createPersistConfig(storage);
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
      }),
  });

  const persistor = persistStore(store);

  return { store, persistor };
};

// Export the store creation functions
export { createStore, createStoreSync };
export type AppDispatch = ReturnType<typeof createStoreSync>['store']['dispatch'];