
import React, { useState } from 'react'
import { asset } from '../../assets/asset'
import moment from 'moment'

const CommentTable = ({ comment, onModerate, onDelete }) => {
  const [showModal, setShowModal] = useState(false)
  const [modalAction, setModalAction] = useState('')

  const handleModerate = (isApproved) => {
    onModerate(comment._id, isApproved)
  }

  const handleDelete = () => {
    setShowModal(false)
    onDelete(comment._id)
  }

  const truncateText = (text, maxLength = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <>
      <tr className='border-b border-gray-200 hover:bg-gray-50 transition-colors'>
        {/* User & Comment */}
        <td className='px-6 py-4'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <img 
                src={comment.userId?.profilePicture || asset.userImage} 
                alt="User" 
                className='w-8 h-8 rounded-full object-cover'
              />
              <div>
                <p className='font-medium text-gray-800 text-sm'>
                  {comment.userId?.username || 'Unknown User'}
                </p>
                <p className='text-xs text-gray-500'>
                  {comment.userId?.email || 'No email'}
                </p>
              </div>
            </div>
            <div className='bg-gray-50 p-3 rounded border-l-4 border-primary/20'>
              <p className='text-sm text-gray-700'>
                {truncateText(comment.content)}
              </p>
              {comment.edited && (
                <span className='inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-2'>
                  Edited {moment(comment.editedAt).fromNow()}
                </span>
              )}
            </div>
            <div className='flex items-center gap-4 text-xs text-gray-500'>
              <span>♥ {comment.likes?.length || 0} likes</span>
              {comment.replies?.length > 0 && (
                <span>💬 {comment.replies.length} replies</span>
              )}
            </div>
          </div>
        </td>

        {/* Blog Post */}
        <td className='px-6 py-4'>
          <div className='max-w-xs'>
            <p className='font-medium text-primary text-sm truncate'>
              {comment.postId?.title || 'Unknown Post'}
            </p>
            <p className='text-xs text-gray-500 mt-1'>
              Post ID: {comment.postId?._id || 'N/A'}
            </p>
          </div>
        </td>

        {/* Date */}
        <td className='px-6 py-4 max-sm:hidden'>
          <div className='text-sm'>
            <p className='text-gray-700'>
              {moment(comment.createdAt).format('MMM DD, YYYY')}
            </p>
            <p className='text-xs text-gray-500'>
              {moment(comment.createdAt).fromNow()}
            </p>
          </div>
        </td>

        {/* Status */}
        <td className='px-6 py-4'>
          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
            comment.isApproved 
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
          }`}>
            {comment.isApproved ? 'Approved' : 'Pending Review'}
          </span>
        </td>

        {/* Actions */}
        <td className='px-6 py-4'>
          <div className='flex items-center gap-2'>
            {!comment.isApproved ? (
              <button
                onClick={() => handleModerate(true)}
                className='flex items-center gap-1 px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors'
                title='Approve Comment'
              >
                <img src={asset.tickIcon} alt="Approve" className='w-4 h-4' />
                Approve
              </button>
            ) : (
              <button
                onClick={() => handleModerate(false)}
                className='flex items-center gap-1 px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors'
                title='Unapprove Comment'
              >
                <img src={asset.crossIcon} alt="Unapprove" className='w-4 h-4' />
                Unapprove
              </button>
            )}
            
            <button
              onClick={() => {
                setModalAction('delete')
                setShowModal(true)
              }}
              className='flex items-center gap-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors'
              title='Delete Comment'
            >
              <img src={asset.binIcon} alt="Delete" className='w-4 h-4' />
              Delete
            </button>
          </div>
        </td>
      </tr>

      {/* Delete Confirmation Modal */}
      {showModal && modalAction === 'delete' && (
        <tr>
          <td colSpan="5" className="p-0">
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
                <h3 className="text-lg font-semibold mb-4">Delete Comment</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this comment? This action cannot be undone.
                  {comment.replies?.length > 0 && (
                    <span className="block mt-2 text-amber-600 font-medium">
                      Warning: This will also delete {comment.replies.length} replies.
                    </span>
                  )}
                </p>
                <div className="bg-gray-50 p-3 rounded border-l-4 border-gray-300 mb-4">
                  <p className="text-sm text-gray-700 italic">
                    "{truncateText(comment.content, 150)}"
                  </p>
                </div>
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Delete Comment
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default CommentTable