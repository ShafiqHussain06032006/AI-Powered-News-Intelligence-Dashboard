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
  const { add } = useToasts()

  const doSearch = async (params)=>{
    if(!params.q){ add('Please enter a search term', 'error'); return }
    setLoading(true)
    const longTimer = setTimeout(()=> add('Taking longer than usual...', 'info', 3000), 3000)
    try{
      const resp = await api.get('search/', { params })
      setArticles(resp.data.articles || [])
    }catch(err){
      add(err.response?.data?.message || 'Search failed', 'error')
    }finally{ setLoading(false) }
    clearTimeout(longTimer)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">AI News Intelligence Dashboard</h1>
        <ThemeToggle />
      </div>
      <SearchBar onSearch={doSearch} />
      <FilterBar />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              Array.from({length:4}).map((_,i)=>(<SkeletonCard key={i}/>))
            ) : (
              articles.map((a,idx)=>(<ArticleCard key={idx} article={a}/>))
            )}
          </div>
        </div>
        <div className="lg:col-span-1">
          <SummaryPanel articles={articles} />
          <TrendingKeywords onPick={(q)=>doSearch({q})} />
          <SavedArticles />
        </div>
      </div>
      <CountryCompare />
    </div>
  )
}

function SkeletonCard(){
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded animate-pulse">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
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
    <button onClick={toggle} className="px-3 py-1 border rounded">{dark?'Light':'Dark'}</button>
  )
}
