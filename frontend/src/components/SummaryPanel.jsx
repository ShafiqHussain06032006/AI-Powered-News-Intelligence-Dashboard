import React from 'react'

export default function SummaryPanel(){
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow mb-4">
      <button className="w-full py-2 bg-green-600 text-white rounded">Summarize top headlines</button>
      <div className="mt-3">AI summary will appear here.</div>
    </div>
  )
}
