"use client"

import Link from 'next/link'
import { useEffect } from 'react'
import getConfig from 'next/config'

export default function NotFound() {
  const { publicRuntimeConfig } = getConfig() || { publicRuntimeConfig: { basePath: '' } }
  const basePath = publicRuntimeConfig.basePath || ''

  useEffect(() => {
    // Log the error for analytics purposes
    console.error('404 page not found error')
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <h1 className="text-white text-3xl font-bold">Page Not Found</h1>
        </div>
        
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="120" 
              height="120" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-gray-400"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          
          <p className="text-gray-700 text-lg mb-4">
            Sorry, we couldn't find the page you're looking for.
          </p>
          
          <p className="text-gray-600 mb-6">
            The page may have been moved, deleted, or might never have existed.
            Please check the URL or navigate back to the homepage.
          </p>
          
          <div className="flex justify-center">
            <Link 
              href={`${basePath}/`} 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 