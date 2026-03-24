import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadingScreen />
    <BrowserRouter>
      <AppProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
)
