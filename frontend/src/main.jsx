import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import './index.css'
import App from './App.jsx'
import '@mantine/carousel/styles.css';
import { CartProvider } from './Context/CartContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </MantineProvider>
  </StrictMode>
)
