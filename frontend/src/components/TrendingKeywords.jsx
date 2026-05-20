import React, {useEffect, useState} from 'react'
import api from '../services/api'

export default function TrendingKeywords({onPick}){
  const [keywords, setKeywords] = useState([])
  useEffect(()=>{
    let mounted = true
    api.get('trending/').then(r=>{ if(mounted) setKeywords(r.data.keywords || []) }).catch(()=>{})
    return ()=> mounted = false
  },[])

  return (
    <div className="mb-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
      <h3 className="mb-3 font-semibold text-slate-950 dark:text-white">Trending Keywords</h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map(k=> (
          <button key={k.word} onClick={()=>onPick && onPick(k.word)} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-teal-50 hover:text-teal-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-teal-950">{k.word}</button>
        ))}
      </div>
    </div>
  )
}
