

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import CommentTable from '../../components/admin/CommentTable'

const Comment = () => {
  const { user } = useSelector((state) => state.user)
  
  const [comments, setComments] = useState([])
  const [filter, setFilter] = useState('all')
  const [showMore, setShowMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchComments = async (startIndex = 0) => {
    if (!user?.isAdmin) {
      setError('Access denied. Admin privileges required.')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      const response = await fetch(
        `/api/comments/admin/all?startIndex=${startIndex}&limit=10&filter=${filter}`,
        {
          credentials: 'include'
        }
      )
      
      const data = await response.json()
      
      if (response.ok) {
        if (startIndex === 0) {
          setComments(data.comments)
        } else {
          setComments(prev => [...prev, ...data.comments])
        }
        setShowMore(data.comments.length === 10)
      } else {
        setError(data.message || 'Failed to fetch comments')
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
      setError('Error fetching comments: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleShowMore = async () => {
    const startIndex = comments.length
    await fetchComments(startIndex)
  }

  // Moderate comment (approve/reject)
  const moderateComment = async (commentId, isApproved) => {
    try {
      const response = await fetch(`/api/comments/admin/moderate/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ isApproved })
      })

      if (response.ok) {
      
        fetchComments()
        alert(`Comment ${isApproved ? 'approved' : 'rejected'} successfully`)
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to moderate comment')
      }
    } catch (error) {
      console.error('Error moderating comment:', error)
      alert('Failed to moderate comment')
    }
  }

  // Delete comment
  const deleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return

    try {
      const response = await fetch(`/api/comments/delete/${commentId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        fetchComments()
        alert('Comment deleted successfully')
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to delete comment')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('Failed to delete comment')
    }
  }

  useEffect(() => {
    fetchComments()
  }, [user, filter])

  if (!user?.isAdmin) {
    return (
      <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
        <div className="bg-red-100 border border-red-300 rounded p-4 text-red-700">
          Access denied. Only administrators can manage comments.
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-primary/5'>
      <div className='flex justify-between items-center max-w-6xl mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Comment Management</h1>
        
        {/* Filter Buttons */}
        <div className='flex gap-2'>
          <button 
            onClick={() => setFilter('all')} 
            className={`px-4 py-2 rounded-full text-sm border transition-all hover:scale-105 ${
              filter === 'all' 
                ? 'bg-primary text-white border-primary' 
                : 'bg-white text-gray-600 border-gray-300 hover:border-primary'
            }`}
          >
            All ({comments.length})
          </button>
          <button 
            onClick={() => setFilter('pending')} 
            className={`px-4 py-2 rounded-full text-sm border transition-all hover:scale-105 ${
              filter === 'pending' 
                ? 'bg-yellow-500 text-white border-yellow-500' 
                : 'bg-white text-gray-600 border-gray-300 hover:border-yellow-500'
            }`}
          >
            Pending Review
          </button>
          <button 
            onClick={() => setFilter('approved')} 
            className={`px-4 py-2 rounded-full text-sm border transition-all hover:scale-105 ${
              filter === 'approved' 
                ? 'bg-green-500 text-white border-green-500' 
                : 'bg-white text-gray-600 border-gray-300 hover:border-green-500'
            }`}
          >
            Approved
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && comments.length === 0 && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded text-blue-700">
          Loading comments...
        </div>
      )}

      <div className='relative h-4/5 max-w-6xl overflow-x-auto mt-4 bg-white shadow rounded-lg'>
        <table className='w-full text-sm text-gray-700'>
          <thead className='text-xs text-gray-700 text-left uppercase bg-gray-50'>
            <tr>
              <th scope='col' className='px-6 py-4'>User & Comment</th>
              <th scope='col' className='px-6 py-4'>Blog Post</th>
              <th scope='col' className='px-6 py-4 max-sm:hidden'>Date</th>
              <th scope='col' className='px-6 py-4'>Status</th>
              <th scope='col' className='px-6 py-4'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.length === 0 && !loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-600">
                  {filter === 'all' ? 'No comments found' : `No ${filter} comments found`}
                </td>
              </tr>
            ) : (
              comments.map((comment, index) => (
                <CommentTable 
                  key={comment._id} 
                  comment={comment} 
                  index={index + 1}
                  onModerate={moderateComment}
                  onDelete={deleteComment}
                />
              ))
            )}
          </tbody>
        </table>
        
        {showMore && comments.length > 0 && (
          <div className='flex justify-center my-4'>
            <button
              onClick={handleShowMore}
              disabled={loading}
              className='px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 disabled:opacity-50 transition-colors'
            >
              {loading ? 'Loading...' : 'Load More Comments'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Comment