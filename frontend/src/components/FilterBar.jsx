import React from 'react'

export default function FilterBar(){
  return (
    <div className="mt-2 flex gap-2 items-center">
      <select className="p-2 rounded border">
        <option value="">Country</option>
        <option value="us">US</option>
        <option value="gb">GB</option>
        <option value="pk">PK</option>
        <option value="in">IN</option>
        <option value="au">AU</option>
      </select>
      <select className="p-2 rounded border">
        <option value="">Category</option>
        <option value="business">Business</option>
        <option value="technology">Technology</option>
      </select>
      <select className="p-2 rounded border">
        <option value="7">Last 7 days</option>
        <option value="30">Last 30 days</option>
      </select>
    </div>
  )
}
