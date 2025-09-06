
import React from 'react'
import { asset } from '../../assets/asset'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const UserTable = ({ users, index, fetchUsers }) => {
  const navigate = useNavigate();

  // Extract properties from the users object 
  const { _id, username, email, createdAt, isAdmin, profilePicture } = users
  const userDate = new Date(createdAt)
  const [showModal, setShowModal] = useState(false)
  const [userIdDeleting, setUserIdDeleting] = useState(null)
  const { user } = useSelector((state) => state.user);

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const response = await fetch(`/api/users/delete-profile/${userIdDeleting}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        console.log('User deleted successfully');
        fetchUsers(); 
        setShowModal(false);
      } else {
        const errorData = await response.json();
        console.error('Failed to delete user:', errorData.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  return (
    <>
      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
        {/* Index */}
        <th className="px-4 py-3 font-medium text-gray-700 text-center">
          {index}
        </th>

        {/* User Image */}
        <td className="px-4 py-3">
          <img
            src={profilePicture || asset.defaultAvatar || 'https://via.placeholder.com/80x56?text=User'}
            alt="User"
            className="w-20 h-14 rounded-md object-cover shadow-sm"
          />
        </td>

        {/* User Name */}
        <td className="px-4 py-3 text-primary font-semibold">{username}</td>

        {/* Email */}
        <td className="px-4 py-3 text-gray-600">{email || '—'}</td>

        {/* Date */}
        <td className="px-4 py-3 text-sm text-gray-500 max-sm:hidden">
          {userDate.toDateString()}
        </td>

        {/* Admin Status */}
        <td className="px-4 py-3 text-gray-600 max-sm:hidden">
          {isAdmin ? (
            <img src={asset.tickIcon} alt="Admin" className="w-5 h-5" />
          ) : (
            <img src={asset.crossIcon} alt="Not Admin" className="w-5 h-5" />
          )}
        </td>

        {/* Actions */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <button 
              className="px-3 py-1 text-xs rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 shadow-sm transition-transform hover:scale-105"
              onClick={() => {
                setShowModal(true);
                setUserIdDeleting(_id); 
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
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                onClick={handleDeleteUser}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UserTable