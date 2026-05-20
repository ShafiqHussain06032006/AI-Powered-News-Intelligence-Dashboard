import React, {useState} from 'react'
import api from '../services/api'

export default function CountryCompare(){
  const [q, setQ] = useState('')
  const [results, setResults] = useState(null)

  const doCompare = async ()=>{
    if(!q) return
    try{
      const resp = await api.get('compare/', { params: { q, countries: 'us,pk,in' }})
      setResults(resp.data.compare)
    }catch(e){ setResults({error: true}) }
  }

  return (
    <section className="mt-6 rounded-lg border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
      <h3 className="font-semibold text-slate-950 dark:text-white">Country Compare</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Compare coverage across the United States, Pakistan, and India.</p>
      <div className="mt-3 flex gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Topic to compare" className="min-h-11 flex-1 rounded border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-950" />
        <button onClick={doCompare} className="rounded bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950">Compare</button>
      </div>
      {results && (
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {Object.entries(results).map(([c,val])=> (
            <div key={c} className="rounded border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{c}</h4>
              {val && val.error ? <div className="text-sm text-red-500">Error</div> : (
                <ul className="space-y-2 text-sm">
                  {(val || []).slice(0,5).map((a,i)=>(<li key={i}><a className="line-clamp-2 text-slate-700 hover:text-teal-700 dark:text-slate-300" href={a.url} target="_blank" rel="noreferrer">{a.title}</a></li>))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
