

import React, { useState, useEffect } from 'react'
import { asset } from '../assets/asset'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAuthMessage, setShowAuthMessage] = useState(false)
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get user from Redux state
  const { user } = useSelector((state) => state.user)

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get('searchTerm');
    if (search) {
      setSearchTerm(search);
    }
  }, [location.search])

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if user is signed in
    if (!user) {
      setShowAuthMessage(true);
      
      setTimeout(() => {
        setShowAuthMessage(false);
      }, 3000);
      return;
    }

    // If user is signed in, proceed with search
    navigate(`/search?searchTerm=${encodeURIComponent(searchTerm)}`);
  };

  const handleInputClick = () => {
    // Show auth message when user clicks input without being signed in
    if (!user) {
      setShowAuthMessage(true);
      setTimeout(() => {
        setShowAuthMessage(false);
      }, 3000);
    }
  };

  return (
    <div className='mx-8 sm:mx-16 xl:mx-24 relative'>
      <div className='text-center mt-20 mb-8'>
        <div className='inline-flex items-center justify-center gap-4 px-6 py-1.5 mb-4 border border-primary/50 bg-primary/20 rounded-full text-sm text-primary'>
          <p>Supported with AI Blog Writer</p>
          <img src={asset.starIcon} className='w-5' alt="" />
        </div>
        
        <h1 className='text-4xl sm:text-6xl font-bold sm:leading-16 text-blue-800'>
          <span className='text-blue-400'>AI</span> POWERED <span className='text-teal-200'>BLOGGING </span><br />PLATFORM
        </h1>
        
        <p className="text-2xl text-gray-700 mt-2 max-w-xl mx-auto text-center">
          Blog better, blog smarter — with <span className="font-semibold text-primary">NeoBlog</span>.
        </p>
        
        <p className='my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-gray-900'>
          <span className='text-bold text-xl'>NeoBlog</span> is your intelligent blogging companion — powered by AI, built for creators. Generate high-quality, engaging blog posts in seconds with just a prompt. Whether you're a writer, marketer, or startup, NeoBlog helps you publish faster, grow faster, and think bigger.
        </p>
        
        {/* Auth Message */}
        {showAuthMessage && (
          <div className='mb-4 max-w-lg mx-auto'>
            <div className='bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg animate-pulse'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <svg className='h-5 w-5 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
                    <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                  </svg>
                </div>
                <div className='ml-3'>
                  <p className='text-sm font-medium text-red-800'>
                    🔐 Please sign in first to search for blogs!
                  </p>
                  <p className='text-xs text-red-600 mt-1'>
                    Create an account or login to access search functionality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Search form */}
        <form className='flex justify-between max-w-lg max-sm:scale-75 mx-auto border border-gray-500 bg-white rounded overflow-hidden relative' onSubmit={handleSubmit}>
          <input 
            type='text'
            placeholder={user ? 'Search for blogs' : 'Sign in to search blogs'}
            required={user ? true : false}
            className={`w-full pl-4 outline-none ${!user ? 'cursor-pointer bg-gray-50' : ''}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={handleInputClick}
            readOnly={!user}
          />
          
          {/* Overlay for non-authenticated users */}
          {!user && (
            <div className='absolute inset-0 bg-gray-100 bg-opacity-50 cursor-pointer flex items-center justify-center' onClick={handleInputClick}>
              <span className='text-gray-500 text-sm flex items-center'>
                <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'></path>
                </svg>
                Sign in to search
              </span>
            </div>
          )}
          
          <button 
            type='submit' 
            disabled={!user}
            className={`px-8 py-2 m-1.5 rounded transition-all cursor-pointer ${
              user 
                ? 'bg-primary text-white hover:scale-105' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {user ? 'Search' : '🔒 Sign In'}
          </button>
        </form>
        
        {/* User Status Indicator */}
        <div className='mt-4'>
          {user ? (
            <p className='text-sm text-green-600 flex items-center justify-center'>
              <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'></path>
              </svg>
              Welcome back, {user.username || user.email}! 👋
            </p>
          ) : (
            <p className='text-sm text-gray-600 flex items-center justify-center'>
              <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'></path>
              </svg>
              Sign in to unlock the full NeoBlog experience! ✨ 
            </p>
          )}
        </div>
      </div>
      
      <img src={asset.gradientBackground} alt="" className='absolute -top-50 -z-1 opacity-70 w-full' />
    </div>
  )
}

export default Header;