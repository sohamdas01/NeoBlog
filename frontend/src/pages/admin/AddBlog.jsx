

import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import 'quill/dist/quill.snow.css'

import { asset, blogCategories } from '../../assets/asset'
import Quill from 'quill'
import Loader from '../../components/Loader'
import { marked } from "marked";

const AddBlog = () => {
  const editorRef = useRef(null)
  const quillRef = useRef(null)
  const navigate = useNavigate()

  //  user from Redux
  const { user } = useSelector((state) => state.user)

  const [image, setImage] = useState(false)
  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [category, setCategory] = useState('startup')
  const [ispublished, setIspublished] = useState(false)
  const [publishError, setPublishError] = useState(null)
  const [publishSuccess, setPublishSuccess] = useState(null) 
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    //  Check if user is authenticated and is admin
    if (!user) {
      setPublishError('You must be logged in to create a post')
      setPublishSuccess(null)
      return
    }

    if (!user.isAdmin) {
      setPublishError('Only admins can create posts')
      setPublishSuccess(null)
      return
    }

    //  Validate required fields
    if (!title.trim()) {
      setPublishError('Title is required')
      setPublishSuccess(null)
      return
    }

    if (!subTitle.trim()) {
      setPublishError('Subtitle is required')
      setPublishSuccess(null)
      return
    }

    if (!image) {
      setPublishError('Thumbnail image is required')
      setPublishSuccess(null)
      return
    }

    if (!quillRef.current || !quillRef.current.root.innerHTML.trim() || quillRef.current.root.innerHTML === '<p><br></p>') {
      setPublishError('Blog description is required')
      setPublishSuccess(null)
      return
    }

    try {
      setLoading(true)
      setPublishError(null)
      setPublishSuccess(null)

      // Create FormData with individual fields (matching backend expectation)
      const formData = new FormData()
      formData.append('title', title.trim())
      formData.append('subTitle', subTitle.trim())
      formData.append('description', quillRef.current.root.innerHTML)
      formData.append('category', category)
      formData.append('isPublished', ispublished.toString()) // ✅ Convert boolean to string
      formData.append('image', image)

      const res = await fetch('/api/posts/create-post', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      const data = await res.json()
      if (res.ok) {
        setPublishError(null)
        setPublishSuccess('Blog created successfully!')
    

        //  Reset form after a delay to show success message
        setTimeout(() => {
          setImage(false)
          setTitle('')
          setSubTitle('')
          setCategory('startup')
          setIspublished(false)
          setPublishSuccess(null)
          if (quillRef.current) {
            quillRef.current.setContents([])
          }
          
          // Navigate to blog list or dashboard
          // navigate('/admin/listBlog')
        }, 2000)
        
      } else {
        setPublishError(data.message || 'Error creating blog')
          setPublishSuccess(null)
        
      }
    } catch (error) {
      console.error('Network error:', error)
      setPublishSuccess(null)
      setPublishError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const generateContent = async () => {
    if (!title.trim()) {
      setPublishError('Title is required to generate content')
      setPublishSuccess(null)
      return
    }

    try {
      setLoading(true)
      setPublishError(null)
      setPublishSuccess(null)
      
      const res = await fetch('/api/posts/generate-content', {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: title.trim() })
      })

      const data = await res.json()

      if (res.ok) {
        console.log('Generated content:', data)
        quillRef.current.root.innerHTML = marked(data.generatedText)
        setPublishSuccess('Content generated successfully!')
        
        //  Clear success message after a delay
        setTimeout(() => setPublishSuccess(null), 5000)
      } else {
        console.error('Error generating content:', data)
        setPublishError(data.message || 'Error generating content')
      }
    } catch (error) {
      console.error('Error generating content:', error)
      setPublishError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initiate quill only once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
    }
  }, [])

  return (
    <form onSubmit={onSubmitHandler} className='flex-1  text-gray-600 h-full overflow-scroll'>
      <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>

        {/* Success message display */}
        {publishSuccess && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded text-green-700">
            {publishSuccess}
          </div>
        )}

        {/* Error message display */}
        {publishError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
            {publishError}
          </div>
        )}

        {/* upload thumbnail image */}
        <p className='text-primary'>Upload thumbnail</p>
        <label htmlFor="image">
          <img 
            src={!image ? asset.upload : URL.createObjectURL(image)} 
            alt="Upload thumbnail" 
            className="w-32 h-32 object-cover border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-400 transition-colors"
          />
          <input 
            onChange={(e) => {
              setImage(e.target.files[0])
              // Clear any previous error when user selects an image
              if (publishError && publishError.includes('Thumbnail')) {
                setPublishError(null)
              }
            }} 
            type="file" 
            id='image' 
            hidden 
            accept="image/*"
          />
        </label>

        {/* blog title */}
        <p className='mt-4 text-primary'>Blog Title</p>
        <input
          type='text'
          placeholder='Enter Title'
          value={title}
          className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded focus:border-blue-400'
          onChange={e => {
            setTitle(e.target.value)
            // Clear title-related errors
            if (publishError && publishError.includes('Title')) {
              setPublishError(null)
            }
          }}
        />

        {/* subTitle */}
        <p className='mt-4 text-primary'>Blog Subtitle</p>
        <input
          type='text'
          placeholder='Enter Subtitle'
          value={subTitle}
          className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded focus:border-blue-400'
          onChange={e => {
            setSubTitle(e.target.value)
            // Clear subtitle-related errors
            if (publishError && publishError.includes('Subtitle')) {
              setPublishError(null)
            }
          }}
        />

        {/* blog description */}
        <p className='mt-4 text-primary'>Blog Description</p>
        <div className='max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative'>
          <div ref={editorRef}></div>
          {loading && (
            <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded'>
              <div className='w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin'></div>
            </div>
          )}
          <button
            disabled={loading}
            type='button'
            onClick={generateContent}
            className='absolute bottom-1 right-2 ml-2 text-xs text-white bg-blue-400 px-4 py-1.5 rounded hover:bg-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {loading ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>

        <p className='mt-4 text-primary'>Blog Category</p>
        <select
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          name="category"
          className='mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded focus:border-blue-400'
        >
          <option value="">Select Category</option>
          {blogCategories.map((item, index) => {
            return <option key={index} value={item}>{item}</option>
          })}
        </select>

        <div className='mt-4'>
          <label className='flex items-center gap-2 cursor-pointer'>
            <input
              type="checkbox"
              checked={ispublished}
              className='scale-125 cursor-pointer'
              onChange={(e) => setIspublished(e.target.checked)}
            />
            <span>Publish Now</span>
          </label>
        </div>

        {/* submit button */}
        <button
          disabled={loading}
          type='submit'
          className='mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors'
        >
          {loading ? 'Adding...' : 'Add Blog'}
        </button>
      </div>
    </form>
  )
}

export default AddBlog
