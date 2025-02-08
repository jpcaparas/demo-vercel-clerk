'use client';

import { Provider } from 'react-redux';
import { createStore, createStoreSync } from '@/store/store';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from '@/utils/theme';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { PersistGate } from 'redux-persist/integration/react';
import { useEffect, useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [storeState, setStoreState] = useState(() => createStoreSync());

  useEffect(() => {
    const initStore = async () => {
      const store = await createStore();
      setStoreState(store);
    };
    initStore();
  }, []);

  return (
    <Provider store={storeState.store}>
      <PersistGate loading={null} persistor={storeState.persistor}>
        <MantineProvider theme={theme}>
          <Notifications position="top-right" />
          {children}
        </MantineProvider>
      </PersistGate>
    </Provider>
  );
}