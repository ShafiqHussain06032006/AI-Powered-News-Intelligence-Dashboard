import React, {useState} from 'react'
import DOMPurify from 'dompurify'

export default function SearchBar({onSearch, filters = {}}){
  const [q, setQ] = useState('')
  const submit = ()=>{
    const clean = DOMPurify.sanitize(q).trim()
    if(clean.length === 0){
      onSearch({q: ''})
      return
    }
    if(clean.length > 500){
      setQ(clean.slice(0,500))
    }
    onSearch({q: clean, ...filters})
  }

  return (
    <div className="flex gap-2">
      <input
        value={q}
        onChange={e=>setQ(e.target.value)}
        onKeyDown={e=>{ if(e.key === 'Enter') submit() }}
        placeholder="Search topics, companies, policies, markets"
        className="min-h-12 flex-1 rounded border border-slate-200 bg-white/90 px-4 text-sm shadow-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-900/80"
      />
      <button onClick={submit} className="min-h-12 rounded bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400">Search</button>
    </div>
  )
}
