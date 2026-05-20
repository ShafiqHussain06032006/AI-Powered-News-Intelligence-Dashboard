import React from 'react'
import Dashboard from './pages/Dashboard'
import { ToastProvider } from './ui/Toast'

export default function App(){
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Dashboard />
      </div>
    </ToastProvider>
  )
}
