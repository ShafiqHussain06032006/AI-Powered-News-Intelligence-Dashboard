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
    try{
      const resp = await api.post('summarize/', { articles })
      setSummary(resp.data.summary)
    }catch(err){ add('Summarization failed','error') }
    finally{ setLoading(false) }
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow mb-4">
      <button onClick={doSummarize} className="w-full py-2 bg-green-600 text-white rounded">{loading? 'Summarizing...':'Summarize top headlines'}</button>
      <div className="mt-3 whitespace-pre-line">{summary || 'AI summary will appear here.'}</div>
    </div>
  )
}
