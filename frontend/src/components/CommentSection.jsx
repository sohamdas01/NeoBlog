

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { asset } from '../assets/asset'
import { FaHeart } from 'react-icons/fa'
const CommentSection = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Fetch comments
  const fetchComments = async (pageNum = 1) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/comments/post/${postId}?page=${pageNum}&limit=10`, {
        credentials: 'include'
      })
      const data = await response.json()

      if (response.ok) {
        if (pageNum === 1) {
          setComments(data.comments)
        } else {
          setComments(prev => [...prev, ...data.comments])
        }
        setHasMore(pageNum < data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  // Add comment
  const handleAddComment = async (e, parentCommentId = null) => {
    e.preventDefault()
    
    if (!currentUser) {
      alert('Please login to comment')
      return
    }

    const content = parentCommentId ? document.getElementById(`reply-${parentCommentId}`).value : newComment
    if (!content.trim()) return

    try {
      const response = await fetch('/api/comments/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          postId,
          content: content.trim(),
          parentComment: parentCommentId
        })
      })

      const data = await response.json()

      if (response.ok) {
        if (parentCommentId) {
          document.getElementById(`reply-${parentCommentId}`).value = ''
          setReplyingTo(null)
        } else {
          setNewComment('')
        }
        fetchComments(1) 
        
        // Show different message based on user role
        if (currentUser.isAdmin) {
          alert('Comment posted successfully!')
        } else {
          alert('Comment submitted! It will be visible after admin approval.')
        }
      } else {
        alert(data.message || 'Failed to add comment')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      alert('Failed to add comment')
    }
  }

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return

    try {
      const response = await fetch(`/api/comments/delete/${commentId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        fetchComments(1)
        alert('Comment deleted!')
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to delete comment')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('Failed to delete comment')
    }
  }

  // Toggle like
  const handleToggleLike = async (commentId) => {
    if (!currentUser) {
      alert('Please login to like comments')
      return
    }

    try {
      const response = await fetch(`/api/comments/like/${commentId}`, {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        fetchComments(1) // Refresh to get updated like count
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  useEffect(() => {
    fetchComments(1)
  }, [postId])

  // Separate component for editing to avoid re-render issues
  const EditCommentForm = ({ comment, onSave, onCancel }) => {
    const [editContent, setEditContent] = useState(comment.content)

    const handleSubmit = async (e) => {
      e.preventDefault()
      if (!editContent.trim()) return

      try {
        const response = await fetch(`/api/comments/update/${comment._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ content: editContent.trim() })
        })

        const data = await response.json()

        if (response.ok) {
          onSave()
          alert('Comment updated!')
        } else {
          alert(data.message || 'Failed to edit comment')
        }
      } catch (error) {
        console.error('Error editing comment:', error)
        alert('Failed to edit comment')
      }
    }

    return (
      <form onSubmit={handleSubmit} className='mt-2'>
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className='w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-primary/50'
          rows="3"
          required
          autoFocus
        />
        <div className='flex gap-2 mt-2'>
          <button 
            type='submit' 
            className='bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary/80'
          >
            Save
          </button>
          <button 
            type='button'
            onClick={onCancel}
            className='bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600'
          >
            Cancel
          </button>
        </div>
      </form>
    )
  }

  const CommentItem = ({ comment, isReply = false }) => {
    const [isEditing, setIsEditing] = useState(false)
    const isOwner = currentUser && currentUser._id === comment.userId._id
    const isAdmin = currentUser && currentUser.isAdmin

    const handleEditSave = () => {
      setIsEditing(false)
      fetchComments(1) // Refresh comments
    }

    const handleEditCancel = () => {
      setIsEditing(false)
    }

    return (
      <div className={`${isReply ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''} mb-4`}>
        <div className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm'>
          {/* Comment Header */}
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center gap-2'>
              <img 
                src={comment.userId.profilePicture || asset.userImage} 
                alt={comment.userId.username}
                className='w-8 h-8 rounded-full object-cover'
              />
              <div>
                <p className='font-medium text-primary text-sm'>
                  {comment.userId.username}
                </p>
                <p className='text-xs text-gray-500'>
                  {moment(comment.createdAt).fromNow()}
                  {comment.edited && <span className='ml-1'>(edited)</span>}
                </p>
              </div>
            </div>
            
            {(isOwner || isAdmin) && !isEditing && (
              <div className='flex items-center gap-2'>
                {isOwner && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className='text-xs text-blue-600 hover:underline'
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className='text-xs text-red-600 hover:underline'
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Comment Content */}
          {isEditing ? (
            <EditCommentForm 
              comment={comment} 
              onSave={handleEditSave} 
              onCancel={handleEditCancel} 
            />
          ) : (
            <p className='text-sm text-gray-700 mb-3'>{comment.content}</p>
          )}

          {/* Comment Actions */}
          {!isEditing && (
            <div className='flex items-center gap-4 text-xs'>
              <button
                onClick={() => handleToggleLike(comment._id)}
                className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                  comment.likes.includes(currentUser?._id) ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                <FaHeart className='text-lg' /> {comment.likes.length}
              </button>
              
              {!isReply && currentUser && (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                  className='text-gray-500 hover:text-primary transition-colors'
                >
                  Reply
                </button>
              )}
            </div>
          )}

          {/* Reply Form */}
          {replyingTo === comment._id && (
            <form onSubmit={(e) => handleAddComment(e, comment._id)} className='mt-3 pt-3 border-t'>
              <textarea
                id={`reply-${comment._id}`}
                placeholder='Write a reply...'
                className='w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-primary/50'
                rows="2"
                required
              />
              <div className='flex gap-2 mt-2'>
                <button 
                  type='submit' 
                  className='bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary/80'
                >
                  Reply
                </button>
                <button 
                  type='button'
                  onClick={() => setReplyingTo(null)}
                  className='bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600'
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className='mt-3'>
            {comment.replies.map((reply) => (
              <CommentItem key={reply._id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='mt-14 mb-10 max-w-3xl mx-auto'>
      <h3 className='text-xl font-semibold mb-6 text-gray-800'>
        Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      {currentUser ? (
        <div className='mb-8 bg-white border border-gray-200 rounded-lg p-4 shadow-sm'>
          <form onSubmit={(e) => handleAddComment(e)}>
            <div className='flex items-start gap-3'>
              <img 
                src={currentUser.profilePicture || asset.userImage} 
                alt={currentUser.username}
                className='w-10 h-10 rounded-full object-cover'
              />
              <div className='flex-1'>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder='Share your thoughts...'
                  className='w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50'
                  rows="3"
                  required
                />
                <div className='flex justify-between items-center mt-3'>
                  <p className='text-xs text-gray-500'>
                    {currentUser.isAdmin 
                      ? 'Your comments are published immediately'
                      : 'Comments are reviewed before publishing'
                    }
                  </p>
                  <button 
                    type='submit' 
                    disabled={!newComment.trim() || loading}
                    className='bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                  >
                    {loading ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className='mb-8 bg-gray-50 border border-gray-200 rounded-lg p-4 text-center'>
          <p className='text-gray-600 mb-3'>Please login to join the conversation</p>
          <Link 
            to='/login' 
            className='bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80 transition-colors inline-block'
          >
            Login to Comment
          </Link>
        </div>
      )}

      {/* Comments List */}
      {loading && comments.length === 0 ? (
        <div className='text-center py-8'>
          <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
          <p className='mt-2 text-gray-600'>Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className='text-center py-8 bg-gray-50 rounded-lg'>
          <p className='text-gray-600'>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <>
          <div className='space-y-4'>
            {comments.map((comment) => (
              <CommentItem key={comment._id} comment={comment} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className='text-center mt-6'>
              <button
                onClick={() => {
                  const nextPage = page + 1
                  setPage(nextPage)
                  fetchComments(nextPage)
                }}
                disabled={loading}
                className='bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors'
              >
                {loading ? 'Loading...' : 'Load More Comments'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CommentSection