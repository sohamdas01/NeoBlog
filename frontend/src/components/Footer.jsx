

import React from 'react'
import { footerData } from '../assets/asset'
import { asset } from '../assets/asset'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'

const Footer = () => {
  // Social media links configuration
  const socialLinks = {
    'Facebook': 'https://www.facebook.com/soham.das.920883',
    'Twitter': '//twitter.com/my-handle',
    'Instagram': '//instagram.com/my-handle',
    'LinkedIn': 'https://www.linkedin.com/in/soham-das-5a813528a',
    'YouTube': '//youtube.com/@my-channel'
  }

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/5'>
      <div className='flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500 text-gray-600'>
        <div>
          <div className='flex'>
            <img src={asset.navbarLogo} alt="navbarLogo" className='w-auto h-auto' />
            <b className='font-bold mt-3 text-3xl text-primary cursor-pointer'>NeoBlog</b>
          </div>
          <p className='max-w-[410px] mt-6'>
            NeoBlog is your personalized space to discover insightful articles on technology, startups, lifestyle, finance, fashion, and more. Curated with care, powered by AI, and built for curious minds.
            <br/> <strong>Stay inspired. Stay informed</strong>.
          </p>
        </div>
        
        <div className='flex flex-wrap justify-between w-full md:w-[45%] gap-5'>
          {footerData.map((section, index) => (
            <div key={index}>
              <h3 className='font-semibold text-base text-gray-700 md:mb-5 mb-2'>{section.title}</h3>
              <ul className='text-sm space-y-1'>
                {section.links.map((link, i) => (
                  <li key={i}>
                    {section.title === 'Follow Us' ? (
                      <a 
                        href={socialLinks[link] || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className='hover:underline transition hover:text-primary flex items-center gap-2'
                      >
                        {/* Social Media Icons using react-icons/fa */}
                        {link === 'Facebook' && <FaFacebook className="w-4 h-4" />}
                        {link === 'Twitter' && <FaTwitter className="w-4 h-4" />}
                        {link === 'Instagram' && <FaInstagram className="w-4 h-4" />}
                        {link === 'LinkedIn' && <FaLinkedin className="w-4 h-4" />}
                        {link === 'YouTube' && <FaYoutube className="w-4 h-4" />}
                        <span>{link}</span>
                      </a>
                    ) : (
                      <a href='#' className='hover:underline transition hover:text-primary'>
                        {link}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className='py-4 text-center text-sm md:text-base text-gray-600'>
        Copyright 2025 © NeoBlog - All Right Reserved
      </p>
    </div>
  )
}

export default Footer