import React, { useState ,useEffect} from 'react'
import { Mail, Lock } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import {Alert} from 'flowbite-react'
import OAuth from './OAuth'
import { useDispatch,useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure,clearError } from '../../redux/user/userSlice'


const Login = () => {
 
  const [email, setEmail] = useState('')       
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const { loading, error: errorMessage } = useSelector((state) => state.user)

  const navigate = useNavigate()

  const formData = { email: email.trim(), password: password.trim() }

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('All fields are required'))

    }
    try {
      dispatch(signInStart())
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (!res.ok) {
         dispatch(signInFailure(data.message))

      }
  
      if (res.ok) {
        navigate('/')
        dispatch(signInSuccess(data.user)) // Dispatching the user data to the Redux store
        console.log(formData)
      }
    } catch (error) {
      dispatch(signInFailure(error.message)) // Dispatching the error message to the Redux store
      console.error("Login error:", error)
    }
  }

  return (
    <div className='flex items-center justify-center h-screen bg-gray-50 px-4'>
      <div className='w-full max-w-sm bg-white shadow-md p-6 rounded-xl'>
        <div className='text-center mb-6'>
          <h1 className='text-3xl font-bold'>
            <span className='text-purple-500'>Login</span>
          </h1>
          <p className='text-gray-500 text-sm mt-1'>Enter your credentials</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
      
          {/* Email Field */}
          <div className='group relative rounded-md p-[2px] bg-gray-200 focus-within:bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300'>
            <div className='flex items-center px-3 bg-white rounded-md'>
              <Mail className='w-4 h-4 text-gray-400' />
              <input onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                value={email}
                required
                type='email'
                placeholder='Email'
                className='w-full px-3 py-2 outline-none bg-white rounded-md '
              />
            </div>
          </div>

          {/* Password Field */}
          <div className='group relative rounded-md p-[2px] bg-gray-200 focus-within:bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300'>
            <div className='flex items-center px-3 bg-white rounded-md'>
              <Lock className='w-4 h-4 text-gray-400' />
              <input onChange={(e) => setPassword(e.target.value)}
                autoComplete='password'
                value={password}
                required
                type='password'
                placeholder='Password'
                className='w-full px-3 py-2 outline-none bg-white rounded-md '
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-all duration-300'
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <div className='flex gap-2 text-sm mt-2'>
          <span> Don't have an account?</span>
          <Link to="/signup" className='text-primary'>
            Signup
          </Link>

        </div>
        <OAuth />

        <div>
          {errorMessage && (
            <Alert color="failure" className="mt-4">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>


    </div>
  )
}

export default Login
