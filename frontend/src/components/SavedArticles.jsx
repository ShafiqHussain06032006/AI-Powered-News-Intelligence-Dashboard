import React, {useState, useEffect} from 'react'

export default function SavedArticles(){
  const [saved, setSaved] = useState([])
  useEffect(()=>{
    try{ const raw = localStorage.getItem('saved_articles') || '[]'; setSaved(JSON.parse(raw)) }catch(e){}
  },[])

  useEffect(()=>{
    const handler = ()=>{ try{ const raw = localStorage.getItem('saved_articles') || '[]'; setSaved(JSON.parse(raw)) }catch(e){} }
    window.addEventListener('saved-article', handler)
    return ()=> window.removeEventListener('saved-article', handler)
  },[])

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
      <h3 className="font-semibold text-slate-950 dark:text-white">Saved Articles</h3>
      {saved.length === 0 ? <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">No saved articles yet</div> : (
        <ul className="mt-3 space-y-2 text-sm">{saved.slice(0,5).map((s,i)=>(<li key={i} className="line-clamp-2 text-slate-700 dark:text-slate-300">{s.title}</li>))}</ul>
      )}
    </div>
  )
}
