

import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AddBlog from './pages/admin/AddBlog'
import BlogList from './pages/admin/BlogList'
import Comment from './pages/admin/Comment'
import Login from './components/admin/Login'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Signup from './components/admin/Signup'
import PrivateRoute from './components/PrivateRoute'
import Profile from './pages/admin/Profile'
import UpdateBlog from './pages/admin/UpdateBlog'
import { DashUser } from './pages/admin/DashUser'
import { useSelector } from 'react-redux'
import Search from './components/Search'

export const App = () => {
  const { user } = useSelector((state) => state.user);
  
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/blog/:id' element={<Blog />} />
        <Route path='/Signup' element={<Signup />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/search' element={<Search />} />
        <Route path='/post/:id' element={<Blog />} />
        <Route element={<PrivateRoute />}>
          <Route path='/admin' element={<Layout />}>
          
            <Route path='profile' element={<Profile />} />
            {user?.isAdmin && (
              <>
                <Route path='dashboard' element={<Dashboard />} />
                <Route path='addBlog' element={<AddBlog />} />
                <Route path='listBlog' element={<BlogList />} />
                <Route path='updateBlog/:postId' element={<UpdateBlog />} />
                  <Route path='dashUser' element={<DashUser />} />
                <Route path='comments' element={<Comment />} />
              </>
            )}
          </Route>
        </Route>
      </Routes>
    </div>
  )
}