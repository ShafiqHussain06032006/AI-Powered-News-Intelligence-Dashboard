import React from 'react'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import ArticleCard from '../components/ArticleCard'
import SummaryPanel from '../components/SummaryPanel'
import TrendingKeywords from '../components/TrendingKeywords'
import CountryCompare from '../components/CountryCompare'
import SavedArticles from '../components/SavedArticles'

export default function Dashboard(){
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">AI News Intelligence Dashboard</h1>
        <div>Theme toggle placeholder</div>
      </div>
      <SearchBar />
      <FilterBar />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ArticleCard />
            <ArticleCard />
          </div>
        </div>
        <div className="lg:col-span-1">
          <SummaryPanel />
          <TrendingKeywords />
          <SavedArticles />
        </div>
      </div>
      <CountryCompare />
    </div>
  )
}
