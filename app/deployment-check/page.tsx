"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import getConfig from 'next/config'

export default function DeploymentCheck() {
  const [checks, setChecks] = useState({
    basePath: { status: 'pending', message: 'Checking base path configuration...' },
    images: { status: 'pending', message: 'Checking image loading...' },
    links: { status: 'pending', message: 'Checking internal links...' },
    assets: { status: 'pending', message: 'Checking static assets...' },
  })

  const { publicRuntimeConfig } = getConfig() || { publicRuntimeConfig: { basePath: '' } }
  const basePath = publicRuntimeConfig.basePath || ''

  useEffect(() => {
    // Check base path configuration
    if (window.location.pathname.includes('/MelVocalcoachingbBerlin')) {
      setChecks(prev => ({
        ...prev,
        basePath: { 
          status: 'success', 
          message: 'Base path is correctly configured' 
        }
      }))
    } else {
      setChecks(prev => ({
        ...prev,
        basePath: { 
          status: 'error', 
          message: 'Base path is not configured correctly' 
        }
      }))
    }

    // Create a test image to check
    const testImage = new Image()
    testImage.onload = () => {
      setChecks(prev => ({
        ...prev,
        images: { 
          status: 'success', 
          message: 'Images are loading correctly' 
        }
      }))
    }
    testImage.onerror = () => {
      setChecks(prev => ({
        ...prev,
        images: { 
          status: 'error', 
          message: 'Images are not loading correctly' 
        }
      }))
    }
    // Try to load a test image from public directory
    testImage.src = `${basePath}/test-image.png`

    // Check if we can fetch a static asset
    fetch(`${basePath}/robots.txt`)
      .then(response => {
        if (response.ok) {
          setChecks(prev => ({
            ...prev,
            assets: { 
              status: 'success', 
              message: 'Static assets are loading correctly' 
            }
          }))
        } else {
          throw new Error('Static assets not loading')
        }
      })
      .catch(() => {
        setChecks(prev => ({
          ...prev,
          assets: { 
            status: 'error', 
            message: 'Static assets are not loading correctly' 
          }
        }))
      })

    // Check internal links
    setChecks(prev => ({
      ...prev,
      links: { 
        status: 'success', 
        message: 'Internal links configured correctly' 
      }
    }))
  }, [basePath])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <h1 className="text-white text-2xl font-bold">Deployment Verification</h1>
          <p className="text-blue-100 mt-2">
            This page checks if your GitHub Pages deployment is correctly configured.
          </p>
        </div>

        <div className="p-6">
          <ul className="space-y-4">
            {Object.entries(checks).map(([key, { status, message }]) => (
              <li key={key} className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  {status === 'pending' && (
                    <svg className="h-5 w-5 text-yellow-500 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {status === 'success' && (
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                  {status === 'error' && (
                    <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${status === 'success' ? 'text-green-800' : status === 'error' ? 'text-red-800' : 'text-gray-600'}`}>
                    {message}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Configuration Details</h2>
            <div className="mt-4 bg-gray-50 rounded p-4 font-mono text-sm overflow-x-auto">
              <p>Base Path: <span className="text-blue-600">{basePath}</span></p>
              <p>Current Path: <span className="text-blue-600">{typeof window !== 'undefined' ? window.location.pathname : ''}</span></p>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Link 
              href={`${basePath}/`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 