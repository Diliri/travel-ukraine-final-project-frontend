'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,

        style: {
          background: '#333',
          color: '#fff',
        },

        success: {
          iconTheme: {
            primary: '#4caf50',
            secondary: '#fff',
          },
        },

        error: {
          iconTheme: {
            primary: '#f44336',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}
