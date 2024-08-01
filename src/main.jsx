import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Auth } from './service/firebaseService'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Auth>
    <App />
  </Auth>,
)
