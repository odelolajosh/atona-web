import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupServiceWorker } from './lib/service.ts'

setupServiceWorker().finally(() => {
  console.log('ServiceWorker registered')
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
