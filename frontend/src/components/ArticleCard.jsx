import React from 'react'

export default function ArticleCard({article}){
  const a = article || {
    title: 'Sample Headline',
    source: 'Example',
    publishedAt: '2026-05-21',
    description: 'Short description',
  }
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <a href={a.url || '#'} target="_blank" rel="noreferrer" className="font-semibold block">{a.title}</a>
      <div className="text-sm text-gray-500">{a.source} • {a.publishedAt}</div>
      <p className="mt-2 text-sm">{a.description}</p>
    </div>
  )
}
