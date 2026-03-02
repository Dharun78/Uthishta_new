'use client'
import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import axios from 'axios'

export default function CustomPage() {
  const params = useParams()
  const slug = params.slug
  
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchPage()
  }, [slug])

  const fetchPage = async () => {
    try {
      const response = await axios.get(`/api/dashboard/custom-pages/${slug}`)
      const pageData = response.data.page
      
      // Only show published pages to public
      if (pageData.status !== 'published') {
        setError(true)
        return
      }
      
      setPage(pageData)
    } catch (error) {
      console.error('Error fetching page:', error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !page) {
    notFound()
  }

  return (
    <>
      {/* Page Content */}
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {page.title}
            </h1>
            {page.metaDescription && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {page.metaDescription}
              </p>
            )}
          </div>

          {/* Page Content */}
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <div 
              className="prose prose-lg max-w-none custom-page-content"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .custom-page-content {
          color: #374151;
          line-height: 1.8;
        }
        
        .custom-page-content h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #111827;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .custom-page-content h2 {
          font-size: 2rem;
          font-weight: 600;
          color: #1f2937;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .custom-page-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .custom-page-content p {
          margin-bottom: 1rem;
        }
        
        .custom-page-content ul,
        .custom-page-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .custom-page-content li {
          margin-bottom: 0.5rem;
        }
        
        .custom-page-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }
        
        .custom-page-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .custom-page-content a:hover {
          color: #1d4ed8;
        }
        
        .custom-page-content blockquote {
          border-left: 4px solid #2563eb;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        .custom-page-content code {
          background-color: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875rem;
        }
        
        .custom-page-content pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        
        .custom-page-content pre code {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }
        
        .custom-page-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        
        .custom-page-content th,
        .custom-page-content td {
          border: 1px solid #e5e7eb;
          padding: 0.75rem;
          text-align: left;
        }
        
        .custom-page-content th {
          background-color: #f9fafb;
          font-weight: 600;
        }
        
        .custom-page-content hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 2rem 0;
        }
      `}</style>
    </>
  )
}
