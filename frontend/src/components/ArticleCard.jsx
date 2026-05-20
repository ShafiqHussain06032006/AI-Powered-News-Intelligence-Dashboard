import React from 'react'

export default function ArticleCard({article}){
  const a = article || {
    title: 'Sample Headline',
    source: 'Example',
    publishedAt: '2026-05-21',
    description: 'Short description',
  }
  const sentiment = a.sentiment?.label || 'neutral'
  const color = sentiment==='positive'? 'bg-green-200 text-green-800' : sentiment==='negative'? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'

  const save = ()=>{
    try{
      const raw = localStorage.getItem('saved_articles') || '[]'
      const arr = JSON.parse(raw)
      arr.unshift(a)
      localStorage.setItem('saved_articles', JSON.stringify(arr.slice(0,50)))
      // crude notification via toast element
      const ev = new CustomEvent('saved-article', { detail: a })
      window.dispatchEvent(ev)
    }catch(e){}
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <div className="flex justify-between">
        <a href={a.url || '#'} target="_blank" rel="noreferrer" className="font-semibold block">{a.title}</a>
        <div className={`px-2 py-1 rounded ${color}`}>{sentiment==='positive'? '🟢 Positive' : sentiment==='negative'? '🔴 Negative' : '🟡 Neutral'}</div>
      </div>
      <div className="text-sm text-gray-500">{a.source} • {a.publishedAt}</div>
      <p className="mt-2 text-sm">{a.description}</p>
      <div className="mt-3 flex justify-end">
        <button onClick={save} className="px-2 py-1 bg-blue-600 text-white rounded">Save</button>
      </div>
    </div>
  )
}
