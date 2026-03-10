console.log("DEBUG: main.jsx loaded");
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

console.log("DEBUG: Rendering App...");
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
