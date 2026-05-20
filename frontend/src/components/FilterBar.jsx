import React from 'react'

export default function FilterBar({filters, onChange}){
  const update = key => event => onChange({...filters, [key]: event.target.value})

  return (
    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
      <select value={filters.country} onChange={update('country')} className="rounded border border-slate-200 bg-white/90 px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
        <option value="">Country</option>
        <option value="us">US</option>
        <option value="gb">GB</option>
        <option value="pk">PK</option>
        <option value="in">IN</option>
        <option value="au">AU</option>
      </select>
      <select value={filters.category} onChange={update('category')} className="rounded border border-slate-200 bg-white/90 px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
        <option value="">Category</option>
        <option value="business">Business</option>
        <option value="technology">Technology</option>
        <option value="science">Science</option>
        <option value="health">Health</option>
      </select>
      <select value={filters.days} onChange={update('days')} className="rounded border border-slate-200 bg-white/90 px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
        <option value="7">Last 7 days</option>
        <option value="30">Last 30 days</option>
      </select>
    </div>
  )
}
