

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useRef, useEffect } from 'react';
import { 
  updateProfilePicture, 
  updateStart, 
  updateSuccess, 
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  logoutSuccess
} from '../../redux/user/userSlice';

const Profile = () => {
  const { user, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  // Profile picture states
  const [file, setFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const filePickRef = useRef();

  // Form states for user info update
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: ''
      });
    }
  }, [user]);

  // Handle profile picture selection
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        setUploadError('Please select an image file');
        return;
      }
      
      // Validate file size (e.g., max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setUploadError('File size should be less than 5MB');
        return;
      }

      setFile(selectedFile);
      setImageFileUrl(URL.createObjectURL(selectedFile));
      setUploadError(null);
      setShowImageModal(false);
    }
  };

  // Auto upload when file is selected
  useEffect(() => {
    if (file) {
      uploadImage();
    }
  }, [file]);

  // Upload profile picture
  const uploadImage = async () => {
    setUploading(true);
    setUploadError(null);

    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await fetch(`/api/auth/update-profile-picture/${user._id}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload image');
      }

      // Update Redux state with new profile picture URL
      dispatch(updateProfilePicture(data.user.profilePicture));
      
      // Update the preview URL to the actual uploaded URL
      setImageFileUrl(data.user.profilePicture);
      
      console.log('Profile picture updated successfully');

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message);
      setFile(null);
      setImageFileUrl(null);
    } finally {
      setUploading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formError) setFormError(null);
    if (error) dispatch(updateFailure(null));
    if (successMessage) setSuccessMessage('');
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission for user info update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage('');

    const fieldsToUpdate = {};
    
    if (formData.username && formData.username.trim() !== user?.username) {
      fieldsToUpdate.username = formData.username.trim();
    }
    
    if (formData.email && formData.email.trim() !== user?.email) {
      fieldsToUpdate.email = formData.email.trim();
    }

    if (formData.password && formData.password.trim() !== '') {
      fieldsToUpdate.password = formData.password.trim();
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
      setFormError('No changes to update');
      return;
    }

    try {
      dispatch(updateStart());
      
      const response = await fetch(`/api/users/update-profile/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(fieldsToUpdate),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(updateSuccess(data.user));
        setFormData(prev => ({ ...prev, password: '' }));
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setFormError(data.message || 'Update failed');
        dispatch(updateFailure(null));
      }
    } catch (error) {
      console.error('Update error:', error);
      setFormError(error.message || 'Something went wrong');
      dispatch(updateFailure(null));
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const response = await fetch(`/api/users/delete-profile/${user._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        dispatch(deleteUserSuccess());
      } else {
        const data = await response.json();
        dispatch(deleteUserFailure(data.message || 'Delete failed'));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message || 'Something went wrong'));
    }
  }

  // Sign out
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(logoutSuccess());
      } else {
        console.log(data.message || 'Logout failed');
      }
    } catch (error) {
      console.log(error.message || 'Something went wrong');
    }
  }

  // Handle profile picture click - show Facebook-style options
  const handleProfilePictureClick = () => {
    setShowImageModal(true);
  };

  // Handle update picture option
  const handleUpdatePicture = () => {
    setShowImageModal(false);
    filePickRef.current.click();
  };

  // Handle view picture option
  const handleViewPicture = () => {
    setShowImageModal(false);
    setShowViewModal(true);
  };

  // Generate default avatar
  const getDefaultAvatar = () => {
    const name = user?.username || 'User';
    const initial = name.charAt(0).toUpperCase();
    return `https://ui-avatars.com/api/?name=${initial}&background=1877f2&color=ffffff&size=128&font-size=0.6&rounded=true`;
  };

  const profileImageSrc = imageFileUrl || user?.profilePicture || getDefaultAvatar();

  return (
    <div className="max-w-lg mx-auto p-6 w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
      {/* Title */}
      <h1 className="my-7 text-center font-extrabold text-3xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        Profile
      </h1>

      {/* Form */}
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <input 
          type="file" 
          accept='image/*' 
          onChange={handleImageChange} 
          ref={filePickRef} 
          hidden
        />
        
        {/* Profile Picture */}
        <div className="relative w-32 h-32 self-center cursor-pointer rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={handleProfilePictureClick}
        >
          <img
            src={profileImageSrc}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              e.target.src = getDefaultAvatar();
            }}
          />
          
          {/* Loading overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Upload Status */}
        {uploadError && (
          <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
            {uploadError}
          </div>
        )}
        
        {uploading && (
          <div className="text-blue-500 text-sm text-center bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
            Uploading image...
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="text-green-500 text-sm text-center bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {(formError || error) && (
          <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
            {formError || error}
          </div>
        )}

        {/* Inputs */}
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white transition-all duration-200"
        />
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white transition-all duration-200"
        />
        
        {/* Password field */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter new password to change"
            value={formData.password}
            onChange={handleInputChange}
            className="p-3 pr-12 w-full rounded-lg border border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-pink-400 dark:bg-gray-800 dark:text-white transition-all duration-200"
          />
          
          {formData.password && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none transition-colors duration-200"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Update Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 shadow-md transform hover:scale-105 transition-all duration-200 ${
            loading ? 'opacity-50 cursor-not-allowed transform-none' : ''
          }`}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      {/* Actions */}
      <div className="flex justify-between mt-6 text-sm font-medium">
        <span className="cursor-pointer text-red-500 hover:text-red-600 transition-colors duration-200" onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200" onClick={handleLogout}>
          Logout
        </span>
      </div>

      {/* Facebook-Style Profile Picture Options Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-80 max-w-sm">
            {/* Modal Header */}
            <div className="p-4 text-center border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Profile picture
              </h3>
            </div>

            {/* Options */}
            <div className="py-2">
              {/* View Photo Option */}
              <button
                onClick={handleViewPicture}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-4 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <span className="text-gray-900 dark:text-white font-medium text-base">View photo</span>
              </button>

              {/* Upload Photo Option */}
              <button
                onClick={handleUpdatePicture}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-4 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-gray-900 dark:text-white font-medium text-base">Upload photo</span>
              </button>
            </div>

            {/* Cancel Button */}
            <div className="border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => setShowImageModal(false)}
                className="w-full py-4 text-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Photo Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-lg w-full">
            {/* Close button */}
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Large profile image */}
            <img
              src={profileImageSrc}
              alt="Profile"
              className="w-full h-auto max-w-md mx-auto rounded-lg shadow-2xl"
              onError={(e) => {
                e.target.src = getDefaultAvatar();
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
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
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile