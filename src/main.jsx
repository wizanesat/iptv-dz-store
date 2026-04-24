
// استيراد الـ Login والـ Auth
import Login from './Login.jsx';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Admin from './Admin.jsx' // سننشئه الآن
import './index.css'

// سنقوم بإنشاء Route محمي بسيط (اختياري للتبسيط الآن سنضيف الروابط فقط)

  


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-secret-portal" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)