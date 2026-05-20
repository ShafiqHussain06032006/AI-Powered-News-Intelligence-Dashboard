import React from 'react'

export default function TrendingKeywords(){
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow mb-4">
      <h3 className="font-semibold mb-2">Trending Keywords</h3>
      <div className="flex flex-wrap gap-2">
        {['AI','OpenAI','Crypto','Pakistan','Cloud','Startups','Health','Science'].map(k=> (
          <button key={k} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded">{k}</button>
        ))}
      </div>
    </div>
  )
}
