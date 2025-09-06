
import React, { useState } from 'react'
import { Mail, Lock, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert } from "flowbite-react";
import OAuth from './OAuth'


const Signup = () => {
  const [username, setusername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const formData = { username: username.trim(), email: email.trim(), password: password.trim() }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('All fields are required')

    }
    try {
      setLoading(true)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (!res.ok) {
        return setErrorMessage('Signup failed')

      }
      setLoading(false)
      if (res.ok) {
        navigate('/Login')
        console.log(formData)
      }
    } catch (error) {
      setErrorMessage(error.message)
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center h-screen bg-gray-50 px-4'>
      <div className='w-full max-w-sm bg-white shadow-md p-6 rounded-xl'>
        <div className='text-center mb-6'>
          <h1 className='text-3xl font-bold'>
            <span className='text-purple-500'>Signup</span>
          </h1>
          <p className='text-gray-500 text-sm mt-1'>Enter your credentials</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* user */}
          <div className='group relative rounded-md p-[2px] bg-gray-200 focus-within:bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300' >
            <div className='flex items-center px-3 bg-white rounded-md'>
              <User className='w-4 h-4 text-gray-400' />
              <input onChange={(e) => setusername(e.target.value)}
                autoComplete="username"
                value={username}
                required
                type="username"
                placeholder='username'

                className='w-full px-3 py-2 outline-none bg-white rounded-md' />

            </div>
          </div>
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
            {loading ? 'Signing up...' : 'Signup'}
          </button>
        </form>
        <div className='flex gap-2 text-sm mt-2'>
          <span>Have an account?</span>
          <Link to="/Login" className='text-primary'>
            Login
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

export default Signup
