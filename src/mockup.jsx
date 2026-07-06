import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from './ThemeContext'
import ServiceFinder from './components/ServiceFinder'
import './index.css'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <main>
        <ServiceFinder />
      </main>
    </ThemeProvider>
  </React.StrictMode>,
)
