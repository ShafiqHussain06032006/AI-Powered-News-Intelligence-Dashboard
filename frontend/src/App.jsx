import React from 'react'
import Dashboard from './pages/Dashboard'
import { ToastProvider } from './ui/Toast'

export default function App(){
  return (
    <ToastProvider>
      <div className="min-h-screen text-slate-950 dark:text-slate-100">
        <Dashboard />
      </div>
    </ToastProvider>
  )
}
