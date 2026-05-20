import React, {useState} from 'react'

export default function SearchBar(){
  const [q, setQ] = useState('')
  return (
    <div className="flex gap-2">
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search topics, e.g. AI, Crypto" className="flex-1 p-2 rounded border" />
      <button className="px-4 py-2 bg-blue-600 text-white rounded">Search</button>
    </div>
  )
}
