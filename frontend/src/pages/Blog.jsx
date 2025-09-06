

import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import { asset } from '../assets/asset'
import moment from 'moment'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import CommentSection from '../components/CommentSection'
import { FaWhatsapp,FaTwitter,FaInstagram,FaFacebook } from 'react-icons/fa'
const Blog = () => {
  const { id } = useParams()
  const { user } = useSelector((state) => state.user)
  
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch blog data from backend
  const fetchBlogData = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log(`Fetching post with ID: ${id}`)
      
   
      const response = await fetch(`/api/posts/post/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('API Response:', result)
        
        if (result.success && result.post) {
          setData(result.post)
        } else {
          setError('Blog post not found')
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error:', response.status, errorData)
        
        if (response.status === 404) {
          setError('Blog post not found')
        } else if (response.status === 400) {
          setError('Invalid blog post ID')
        } else {
          setError(`Failed to load blog post (${response.status})`)
        }
      }
      
    } catch (error) {
      console.error("Error fetching blog:", error)
      setError('Failed to connect to server. Please check if the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchBlogData()
    }
  }, [id])

  if (loading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className="relative">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Blog</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => fetchBlogData()}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
              <Link 
                to="/" 
                className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/80 transition-colors"
              >
                Go Back Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="relative">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto">
            <div className="text-6xl mb-4">📝</div>
            <h1 className="text-2xl font-bold text-gray-600 mb-4">Blog Not Found</h1>
            <p className="text-gray-500 mb-6">The blog post you're looking for doesn't exist.</p>
            <Link 
              to="/" 
              className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/80 transition-colors"
            >
              Go Back Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className='relative'>
      <img src={asset.gradientBackground} alt="" className='absolute -top-50 -z-1 opacity-60' />
      <Navbar />
      
      {/* Blog Header */}
      <div className='text-center mt-20 text-gray-600 px-4'>
        <p className='text-primary py-4 font-medium'>
          Published On {moment(data.createdAt).format('MMMM Do YYYY')}
        </p>
        <h1 className='text-2xl text-purple-400 sm:text-5xl font-semibold mx-auto max-w-4xl leading-tight'>
          {data.title}
        </h1>
        {data.subTitle && (
          <h2 className='my-5 mx-auto text-xl text-gray-700 max-w-3xl'>
            {data.subTitle}
          </h2>
        )}
        {/* <p className='inline-block text-sm text-white py-1 px-4 mb-6 border border-primary/40 font-medium bg-teal-400 rounded-full'>
          {data.author || 'Admin'}
        </p> */}
      </div>

      <div className='mx-5 max-w-5xl md:mx-auto my-10 mt-6'>
        {/* Blog Image */}
        {data.image && (
          <img 
            src={data.image} 
            alt={data.title} 
            className='rounded-3xl mb-8 w-full object-cover h-full' 
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        )}
        
        {/* Blog Content */}
        <div className='max-w-3xl mx-auto'>
          <div 
            className='blog-content prose prose-lg max-w-none' 
            dangerouslySetInnerHTML={{ __html: data.description }}
          ></div>
        </div>

        {/* Category and Tags */}
        {data.category && (
          <div className='max-w-3xl mx-auto mt-8 mb-6'>
            <div className='flex flex-wrap items-center gap-2'>
              <span className='text-sm font-medium text-gray-600'>Category:</span>
              <span className='bg-primary/10 text-primary px-3 py-1 rounded-full text-sm'>
                {data.category}
              </span>
            </div>
          </div>
        )}

        {/* Comment Section - Only show if CommentSection component exists */}
        {typeof CommentSection !== 'undefined' && (
          <CommentSection postId={id} currentUser={user} />
        )}

        {/* Share Section */}
        <div className='max-w-3xl mx-auto mt-12'>
          <p className='font-semibold mb-4 text-gray-700'>Share this article</p>
          <div className='flex gap-4'>
            <FaFacebook
              className='text-blue-400 w-8 h-8 transition-all cursor-pointer hover:scale-110 hover:opacity-80'
              onClick={() => {
                const url = encodeURIComponent(window.location.href)
                const title = encodeURIComponent(data.title)
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
              }}
            />
            
            <FaInstagram
              className='text-blue-400 w-8 h-8 transition-all cursor-pointer hover:scale-110 hover:opacity-80'
              onClick={() => {
                const url = encodeURIComponent(window.location.href)
                const title = encodeURIComponent(data.title)
                window.open(`https://instagram.com/share?url=${url}&text=${title}`, '_blank')
              }}
            />
            <FaTwitter
              className='text-blue-400 w-8 h-8 transition-all cursor-pointer hover:scale-110 hover:opacity-80'
              onClick={() => {
                const url = encodeURIComponent(window.location.href)
                const title = encodeURIComponent(data.title)
                window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank')
              }}
            />
            <FaWhatsapp
              className='text-blue-400 w-8 h-8 transition-all cursor-pointer hover:scale-110 hover:opacity-80'
              onClick={() => {
                const url = encodeURIComponent(window.location.href)
                const title = encodeURIComponent(data.title)
                window.open(`https://wa.me/?text=${title} ${url}`, '_blank')
              }}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default Blog;
