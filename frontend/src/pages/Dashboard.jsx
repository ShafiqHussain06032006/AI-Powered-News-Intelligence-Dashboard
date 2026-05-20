import React, {useState} from 'react'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import ArticleCard from '../components/ArticleCard'
import SummaryPanel from '../components/SummaryPanel'
import TrendingKeywords from '../components/TrendingKeywords'
import CountryCompare from '../components/CountryCompare'
import SavedArticles from '../components/SavedArticles'
import api from '../services/api'
import { useToasts } from '../ui/Toast'

export default function Dashboard(){
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({country: '', category: '', days: '7'})
  const { add } = useToasts()

  const doSearch = async (params)=>{
    if(!params.q){ add('Please enter a search term', 'error'); return }
    setLoading(true)
    const longTimer = setTimeout(()=> add('Taking longer than usual...', 'info', 3000), 3000)
    try{
      const requestParams = {...params}
      if(requestParams.days){
        const from = new Date()
        from.setDate(from.getDate() - Number(requestParams.days))
        requestParams.from_date = from.toISOString().slice(0, 10)
        delete requestParams.days
      }
      Object.keys(requestParams).forEach(key => {
        if(requestParams[key] === '') delete requestParams[key]
      })
      const resp = await api.get('search/', { params: requestParams })
      setArticles(resp.data.articles || [])
    }catch(err){
      add(err.response?.data?.message || 'Search failed', 'error')
    }finally{ setLoading(false) }
    clearTimeout(longTimer)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700 dark:text-teal-300">Live intelligence desk</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">AI News Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">Search global headlines, scan sentiment, compare regions, and turn noisy coverage into quick briefing notes.</p>
        </div>
        <ThemeToggle />
      </div>
      <section className="rounded-lg border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
        <SearchBar onSearch={doSearch} filters={filters} />
        <FilterBar filters={filters} onChange={setFilters} />
      </section>
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Headlines</h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">{articles.length} results</span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {loading ? (
              Array.from({length:4}).map((_,i)=>(<SkeletonCard key={i}/>))
            ) : articles.length === 0 ? (
              <EmptyState />
            ) : (
              articles.map((a,idx)=>(<ArticleCard key={idx} article={a}/>))
            )}
          </div>
        </div>
        <aside className="lg:col-span-1">
          <SummaryPanel articles={articles} />
          <TrendingKeywords onPick={(q)=>doSearch({q})} />
          <SavedArticles />
        </aside>
      </div>
      <CountryCompare />
    </main>
  )
}

function SkeletonCard(){
  return (
    <div className="min-h-60 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="animate-pulse">
        <div className="mb-4 h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mb-3 h-5 w-4/5 rounded bg-slate-300 dark:bg-slate-700" />
        <div className="mb-2 h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  )
}

function EmptyState(){
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 md:col-span-2">
      <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Start with a topic</h3>
      <p className="mt-2 text-sm">Try AI regulation, climate finance, chips, healthcare, or a company name.</p>
    </div>
  )
}

function ThemeToggle(){
  const [dark, setDark] = useState(()=>document.documentElement.classList.contains('dark'))
  const toggle = ()=>{
    document.documentElement.classList.toggle('dark')
    setDark(d=>!d)
  }
  return (
    <button onClick={toggle} className="rounded border border-slate-200 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100">{dark?'Light':'Dark'}</button>
  )
}
