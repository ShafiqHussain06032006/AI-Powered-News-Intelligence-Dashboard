import React, {useState, useEffect} from 'react'

export default function SavedArticles(){
  const [saved, setSaved] = useState([])
  useEffect(()=>{
    try{ const raw = localStorage.getItem('saved_articles') || '[]'; setSaved(JSON.parse(raw)) }catch(e){}
  },[])

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h3 className="font-semibold">Saved Articles</h3>
      {saved.length === 0 ? <div className="text-sm text-gray-500">No saved articles</div> : (
        <ul>{saved.map((s,i)=>(<li key={i}>{s.title}</li>))}</ul>
      )}
    </div>
  )
}
