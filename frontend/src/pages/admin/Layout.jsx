import React from 'react'
import { asset } from '../../assets/asset'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/admin/Sidebar'
import Navbar from '../../components/Navbar'

const Layout = () => {

    const navigate=useNavigate()

    const logout=()=>{
        navigate('/')
    }
  return (
    <>
<div >
        {/* <div className='flex'>
        <img onClick={()=>navigate('/')}  src={asset.navbarLogo} alt="" className='w-auto h-auto cursor-pointer '/>
        <b  onClick={()=>navigate('/')} className='font-bold mt-3 text-3xl text-primary cursor-pointer'>NeoBlog</b>
        </div> 
        <button onClick={()=>logout} className='text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer'>Logout</button> */}
        <Navbar/>
</div>

<div className='flex h-[calc(100vh-70px)}'>
        <Sidebar/>
          <Outlet/> 
</div>
    </>
  )
}

export default Layout