'use client';

import { Provider } from 'react-redux';
import { store, persistor } from '@/store/store';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from '@/utils/theme';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { PersistGate } from 'redux-persist/integration/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MantineProvider theme={theme}>
          <Notifications position="top-right" />
          {children}
        </MantineProvider>
      </PersistGate>
    </Provider>
  );
}