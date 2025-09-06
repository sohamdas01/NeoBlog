import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { asset } from '../assets/asset'
import { FaMoon } from 'react-icons/fa'
import { BsSun } from 'react-icons/bs'
import { useSelector,useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice'
import { logoutSuccess } from '../redux/user/userSlice'
const Navbar = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { theme } = useSelector((state) => state.theme)
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const closeDropdown = () => {
    setIsDropdownOpen(false)
  }

  const handleImageError = () => {
    setImageError(true)
  }

    const handleLogout=async()=>{
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

  const dispatch = useDispatch()
  return (
    <div className='flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32'>
      <div className='flex'>
        <img 
          onClick={() => navigate('/')} 
          src={asset.navbarLogo} 
          alt="navbarLogo" 
          className='w-auto h-auto cursor-pointer' 
        />
        <b 
          onClick={() => navigate('/')} 
          className='font-bold mt-3 text-3xl text-primary cursor-pointer'
        >
          NeoBlog
        </b>
      </div>

      <div className='flex items-center gap-2'>
        {/* Dark mode toggle button */}
        <button className='w-12 h-10 hidden sm:inline hover:scale-105 rounded-full items-center justify-center transition-all duration-200' onClick={() => dispatch(toggleTheme())}>
        {theme==='light'?<FaMoon className='text-gray-600 w-6 h-6' />:<BsSun className='text-yellow-500 w-6 h-6' />}
        </button>

        {user ? (
          <div className='relative'>
            {/* Avatar button */}
            <button
              onClick={toggleDropdown}
              className='flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300 hover:border-gray-400 transition-all duration-200'
            >
          
              <img 
                src={user.profilePicture || '/default-avatar.png'} 
                alt='user profile' 
                className='w-full h-full object-cover'
                
                />
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className='fixed inset-0 z-10' 
                  onClick={closeDropdown}
                ></div>
                
                {/* Dropdown content */}
                <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20'>
                  {/* Header */}
                  <div className='px-4 py-3 border-b border-gray-200'>
                    <span className='block text-sm font-bold text-gray-900'>{user.username}</span>
                    <span className='block text-sm text-gray-500 font-medium truncate'>{user.email}</span>
                  </div>
                  
                  {/* Profile link */}
                  <Link 
                    to='/admin/profile'
                    onClick={closeDropdown}
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200'
                  >
                    Profile
                  </Link>
                  
                  {/* Divider */}
                  <div className='border-t border-gray-200'></div>
                  
                  {/* Signout button */}
                  <button
                    onClick={handleLogout}
                    className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200'
                  >
                    Signout
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button 
            onClick={() => navigate('/Signup')} 
            className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5 hover:bg-primary/90 transition-all duration-200'
          >
            Signup
            <img className='w-3 mt-0.5' src={asset.arrow} alt="arrow" />
          </button>
        )}
      </div>
    </div>
  )
}

export default Navbar