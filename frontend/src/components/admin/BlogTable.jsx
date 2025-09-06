

import React from 'react'
import { asset } from '../../assets/asset'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const BlogTable = ({ blog, index, fetchBlogs }) => {
  const navigate = useNavigate();
  const { title, createdAt, category, isPublished, image } = blog
  const blogDate = new Date(createdAt)
  const [showModal, setShowModal] = useState(false)
  const [postIdDeleting, setPostIdDeleting] = useState(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const { user } = useSelector((state) => state.user);

  const handleDeleteBlog = async () => {
    setShowModal(false);
    try {
      const response = await fetch(`/api/posts/delete-post/${postIdDeleting}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        console.log('Blog deleted successfully');
        fetchBlogs(); // Refresh the blog list
        setShowModal(false);
      } else {
        console.error('Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  }

  const handleTogglePublishStatus = async () => {
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/posts/update-post/${blog._id}/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          isPublished: !isPublished
        })
      });

      if (response.ok) {
        console.log('Blog status updated successfully');
        fetchBlogs();
      } else {
        const errorData = await response.json();
        console.error('Failed to update blog status:', errorData.message);
      }
    } catch (error) {
      console.error('Error updating blog status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  return (
    <>
      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
        {/* Index */}
        <th className="px-4 py-3 font-medium text-gray-700 text-center">
          {index}
        </th>

        {/* Blog Image */}
        <td className="px-4 py-3">
          <img
            src={image}
            alt="Blog"
            className="w-20 h-14 rounded-md object-cover shadow-sm"
          />
        </td>

        {/* Blog Title */}
        <td className="px-4 py-3 text-primary font-semibold">{title}</td>

        {/* Category */}
        <td className="px-4 py-3 text-gray-600">{category || '—'}</td>

        {/* Date */}
        <td className="px-4 py-3 text-sm text-gray-500 max-sm:hidden">
          {blogDate.toDateString()}
        </td>

        {/* Status */}
        <td className="px-4 py-3 max-sm:hidden">
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${
              isPublished
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {isPublished ? 'Published' : 'Unpublished'}
          </span>
        </td>

        {/* Actions */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-1 text-xs rounded-lg font-medium shadow-sm transition-transform hover:scale-105 ${
                isPublished
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              } ${isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleTogglePublishStatus}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus ? 'Updating...' : (isPublished ? 'Unpublish' : 'Publish')}
            </button>

            <button 
              className="px-3 py-1 text-xs rounded-lg font-medium bg-cyan-100 text-cyan-700 hover:bg-cyan-200 shadow-sm transition-transform hover:scale-105"
              onClick={() => {
                navigate(`/admin/updateBlog/${blog._id}`);
              }}
            >
              Edit
            </button>

            <button 
              className="px-3 py-1 text-xs rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 shadow-sm transition-transform hover:scale-105" 
              onClick={() => {
                setShowModal(true);
                setPostIdDeleting(blog._id);
              }}
            >
              Delete
            </button>
          </div>
        </td>
      </tr>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
            <p className="mb-4">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                onClick={handleDeleteBlog}
              >
                Delete Blog
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BlogTable