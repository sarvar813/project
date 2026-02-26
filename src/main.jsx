import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { WishlistProvider } from './context/WishlistContext';
import { ChatProvider } from './context/ChatContext';
import App from './App.jsx'
import './i18n';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <ThemeProvider>
        <ProductProvider>
          <WishlistProvider>
            <CartProvider>
              <ChatProvider>
                <App />
              </ChatProvider>
            </CartProvider>
          </WishlistProvider>
        </ProductProvider>
      </ThemeProvider>
    </ToastProvider>
  </StrictMode>,
);
