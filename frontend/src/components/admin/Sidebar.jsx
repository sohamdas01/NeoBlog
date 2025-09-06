import React from 'react'
import { NavLink } from 'react-router-dom'
import { asset } from '../../assets/asset'
import { useSelector } from 'react-redux'

const Sidebar = () => {
    const { user } = useSelector((state) => state.user);
    return (
        <div>
            {user.isAdmin && (
                <NavLink end={true} to='/admin/dashboard' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && 'bg-primary/10 border-r-4 border-primary'}`} >
                    <img src={asset.dashboardIcon} alt="" className='min-w-4 w-5' />
                    <p className='hidden md:inline-block text-teal-400'>Dashboard</p>
                </NavLink>
            )}
            <NavLink end={true} to='/admin/profile' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && 'bg-primary/10 border-r-4 border-primary'}`} >
                <img src={asset.user} alt="" className='min-w-4 w-5' />
                <p className='hidden md:inline-block text-teal-400'>Profile</p>
            </NavLink>
            {user.isAdmin && (
                <>
                    <NavLink end={true} to='/admin/addBlog' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && 'bg-primary/10 border-r-4 border-primary'}`} >
                        <img src={asset.addIcon} alt="" className='min-w-4 w-5' />
                        <p className='hidden md:inline-block text-teal-400'>Add Blog</p>
                    </NavLink>

                    <NavLink end={true} to='/admin/listBlog' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && 'bg-primary/10 border-r-4 border-primary'}`} >
                        <img src={asset.blogItem} alt="" className='min-w-4 w-5' />
                        <p className='hidden md:inline-block text-teal-400'>Blog Lists</p>
                    </NavLink>

                    <NavLink end={true} to='/admin/dashUser' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && 'bg-primary/10 border-r-4 border-primary'}`} >
                        <img src={asset.users} alt="" className='min-w-4 w-5' />
                        <p className='hidden md:inline-block text-teal-400'>Users</p>
                    </NavLink>

                    <NavLink end={true} to='/admin/comments' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && 'bg-primary/10 border-r-4 border-primary'}`} >
                        <img src={asset.commentIcon} alt="" className='min-w-4 w-5' />
                        <p className='hidden md:inline-block text-teal-400'>Comments</p>
                    </NavLink>
                </>
            )}
        </div>
    )
}

export default Sidebar