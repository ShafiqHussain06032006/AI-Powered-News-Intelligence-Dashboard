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
    <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h3 className="font-semibold">Country Compare (USA / PK / IN)</h3>
      <div className="flex gap-2 mt-2">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Topic to compare" className="flex-1 p-2 rounded border" />
        <button onClick={doCompare} className="px-3 py-1 bg-blue-600 text-white rounded">Compare</button>
      </div>
      {results && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
          {Object.entries(results).map(([c,val])=> (
            <div key={c} className="p-2 bg-gray-50 dark:bg-gray-900 rounded">
              <h4 className="font-semibold">{c.toUpperCase()}</h4>
              {val && val.error ? <div className="text-sm text-red-500">Error</div> : (
                <ul className="text-sm">
                  {(val || []).slice(0,5).map((a,i)=>(<li key={i}><a href={a.url} target="_blank" rel="noreferrer">{a.title}</a></li>))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
