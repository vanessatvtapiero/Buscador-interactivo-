import { useEffect, useState } from 'react'

export default function SearchInput({ onSearch }) {
  const [query, setQuery] = useState('')
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(query)
    }, 500)
    
    return () => clearTimeout(timeout)
  }, [query, onSearch])
  
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
      type="text"
      placeholder="Buscar usuarios..."
    />
  )
}
