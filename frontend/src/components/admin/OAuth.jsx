
import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from "../../firebase"       // Import the initialized Firebase app
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

const OAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const auth = getAuth(app)

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({
      prompt: 'select_account'
    })
    
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider)
      const res = await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: resultFromGoogle.user.displayName,
          email: resultFromGoogle.user.email,
          googlePhotoUrl: resultFromGoogle.user.photoURL 
        })
      })
      
      const data = await res.json()
      if (res.ok) {
        //  Dispatch only the user data, not the entire response
        dispatch(signInSuccess(data.user)) 
        navigate('/')
      } else {
        console.error('Backend error:', data.message)
      }
    } catch (error) {
      console.error('Error during Google Sign-In:', error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
      <div className="mt-2">
        <button
          type="button"
          className="flex items-center justify-center px-5 py-2.5 text-sm font-medium text-purple-600 bg-white border-2 border-purple-300 rounded-lg hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-purple-300 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-purple-500/25"
          onClick={handleGoogleClick}
        >
          <AiFillGoogleCircle className="mr-2 w-6 h-6" />
          Sign in with Google
        </button>
      </div>
    </div>
  )
}

export default OAuth