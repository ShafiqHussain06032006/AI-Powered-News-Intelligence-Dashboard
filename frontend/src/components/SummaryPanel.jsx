import React, {useState} from 'react'
import api from '../services/api'
import { useToasts } from '../ui/Toast'

export default function SummaryPanel({articles=[]}){
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState('')
  const { add } = useToasts()

  const doSummarize = async ()=>{
    if(!articles || articles.length===0){ add('No articles to summarize','error'); return }
    setLoading(true)
    const longTimer = setTimeout(()=> add('Summarization is taking longer than usual...', 'info', 3000), 3000)
    try{
      const resp = await api.post('summarize/', { articles })
      setSummary(resp.data.summary)
    }catch(err){ add(err.message || 'Summarization failed','error') }
    finally{ setLoading(false); clearTimeout(longTimer) }
  }

  return (
    <div className="mb-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mb-3">
        <h3 className="font-semibold text-slate-950 dark:text-white">Briefing Notes</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Summarize the current result set into five bullets.</p>
      </div>
      <button onClick={doSummarize} className="w-full rounded bg-teal-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>{loading? 'Summarizing...':'Summarize headlines'}</button>
      <div className="mt-4 whitespace-pre-line rounded border border-slate-100 bg-slate-50 p-3 text-sm leading-6 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">{summary || 'Summary will appear here after you search.'}</div>
    </div>
  )
}
