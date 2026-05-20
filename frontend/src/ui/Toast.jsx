import React, {createContext, useContext, useState, useCallback, useEffect} from 'react'

const ToastContext = createContext()

export function useToasts(){
  return useContext(ToastContext)
}

export function ToastProvider({children}){
  const [toasts, setToasts] = useState([])
  const add = useCallback((msg, type='info', timeout=4000)=>{
    const id = Date.now()+Math.random()
    setToasts(t=>[...t, {id,msg,type}])
    setTimeout(()=>{ setToasts(t=>t.filter(x=>x.id!==id)) }, timeout)
  },[])

  return (
    <ToastContext.Provider value={{add}}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(t=> (
          <div key={t.id} className={`px-4 py-2 rounded shadow ${t.type==='error'?'bg-red-600 text-white':'bg-gray-800 text-white'}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
