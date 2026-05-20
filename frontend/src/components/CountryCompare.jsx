import React from 'react'

export default function CountryCompare(){
  return (
    <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h3 className="font-semibold">Country Compare (USA / PK / IN)</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
        <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">USA results</div>
        <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">PK results</div>
        <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">IN results</div>
      </div>
    </div>
  )
}
