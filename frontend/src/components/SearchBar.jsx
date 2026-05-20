import React, {useState} from 'react'
import DOMPurify from 'dompurify'

export default function SearchBar({onSearch}){
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
    onSearch({q: clean})
  }

  return (
    <div className="flex gap-2">
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search topics, e.g. AI, Crypto" className="flex-1 p-2 rounded border" />
      <button onClick={submit} className="px-4 py-2 bg-blue-600 text-white rounded">Search</button>
    </div>
  )
}
