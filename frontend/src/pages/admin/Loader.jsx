import React from 'react'

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        {/* Spinning loader */}
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-4"></div>
        
        {/* Loading text */}
        <p className="text-gray-600 font-medium">Loading...</p>
        
        {/*  animated dots */}
        <div className="flex space-x-1 mt-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  )
}

export default Loader