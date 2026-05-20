import React from 'react'

export default function ArticleCard({article}){
  const a = article || {
    title: 'Sample Headline',
    source: 'Example',
    publishedAt: '2026-05-21',
    description: 'Short description',
  }
  const sentiment = a.sentiment?.label || 'neutral'
  const color = sentiment==='positive'? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : sentiment==='negative'? 'bg-rose-50 text-rose-700 ring-rose-200' : 'bg-amber-50 text-amber-700 ring-amber-200'
  const date = a.publishedAt ? new Date(a.publishedAt).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'}) : 'Recent'

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
    <article className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90">
      {a.urlToImage && <img src={a.urlToImage} alt="" className="h-40 w-full object-cover" />}
      <div className="flex min-h-60 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="truncate font-medium">{a.source || 'Unknown source'}</span>
          <span className="shrink-0">{date}</span>
        </div>
        <a href={a.url || '#'} target="_blank" rel="noreferrer" className="text-lg font-semibold leading-snug text-slate-950 transition group-hover:text-teal-700 dark:text-white dark:group-hover:text-teal-300">{a.title}</a>
        <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{a.description || 'No description available.'}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${color}`}>{sentiment}</span>
          <button onClick={save} className="rounded border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-teal-400 hover:text-teal-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-teal-400">Save</button>
        </div>
      </div>
    </article>
  )
}
