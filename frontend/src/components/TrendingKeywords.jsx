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
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow mb-4">
      <h3 className="font-semibold mb-2">Trending Keywords</h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map(k=> (
          <button key={k.word} onClick={()=>onPick && onPick(k.word)} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded">{k.word}</button>
        ))}
      </div>
    </div>
  )
}
