'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import React from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import GetStartedForm from '@/components/home/hero/GetStartedForm'
import { Zap } from 'lucide-react'
const COLORS = {
  accent: '#FF6B6B', 
};

const Banner = () => {
  const [showFormModal, setShowFormModal] = useState(false)
  const [userGender, setUserGender] = useState<string | null>(null)
  const [userMail, setUserMail] = useState<string | null>(null)
  const [hasProfile, setHasProfile] = useState(false)
  const [dbCheckResult, setDbCheckResult] = useState<string | null>(null);

  const handleDbWakey = async () => {
    setDbCheckResult(null);
    try {
      console.log('Wakey Wakey button clicked');
      const res = await fetch('/api/db-wakey-wakey');
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const payload = await res.json();
      setDbCheckResult(`DB woke up successfully. Inserted ID: ${payload.insertedId}`);
    } catch (err: any) {
      setDbCheckResult(`Error: ${err.message}`);
    }
  };
  useEffect(() => {
    const getUserAndProfile = async () => {
      try {
        const resUser = await fetch('/api/users', { credentials: 'include' })
        const userData = await resUser.json()
        setUserGender(userData.gender)
        setUserMail(userData.email.trim().toLowerCase())
        const resProfile = await fetch('/api/users/has_profile', {
          credentials: 'include',
        })
        const profileData = await resProfile.json()
        setHasProfile(profileData.hasProfile)
      } catch (err) {
        console.error('Error fetching user/profile info', err)
      }
    }

    getUserAndProfile()
  }, [])
const normalized = (userMail ?? '').trim().toLowerCase()
const showWakey = normalized === 'suryanshrohil05@gmail.com'

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch('/api/users')
        const data = await res.json()
        setUserGender(data.gender)
      } catch (err) {
        console.error('Failed to fetch user:', err)
      }
    }

    getUser()
  }, [])

  const handleExportPDF = async () => {
    try {
      const res = await fetch('/api/export-pdf')
      if (!res.ok) throw new Error('Failed to export')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'medical_summary.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (err) {
      console.error('PDF export failed:', err)
    }
  }

  return (
    <section className='relative pb-0' id='home-section'>
      <div className='bg-banner-image absolute w-full h-full top-0 blur-390'></div>
      <div className='overflow-hidden'>
      <div className='container lg:pt-20 pt-10 relative'>
        <div className='relative z-10'>
        <div className='grid grid-cols-1 lg:grid-cols-12 my-16 items-center'>
          <div className='lg:col-span-7 mb-16'>
          <h1 className='mb-5 lg:text-start text-center sm:leading-snug leading-tight capitalize'>
            Upload, Store & Export
          </h1>
          <p className='text-white font-normal mb-10 max-w-[70%] lg:text-start text-center lg:mx-0 mx-auto capitalize'>
            Your Medical Records Simplified.<br />
            A fast, secure, and user-friendly platform to store, manage, and export your medical records. Join thousands simplifying their healthcare journey.<br /><br />
            Click on Get Started - fill your info to personalize our service for yourself
          </p>
          <div className='flex align-middle justify-center lg:justify-start'>
      {!hasProfile && (
        <>
          <button
            onClick={() => setShowFormModal(true)}
            className='text-xl font-semibold text-white py-4 px-6 lg:px-12 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary rounded-xl mr-6 cursor-pointer'>
            Get Started
          </button>
          
        </>
      )}
            <button
            onClick={handleExportPDF}
            className='bg-transparent flex justify-center items-center text-white cursor-pointer'>
            <Image
              src={'/images/banner/playbutton.svg'}
              alt='button-image'
              className='mr-3'
              width={47}
              height={47}
            />
            <span className='hover:text-primary'>Export your medical data</span>
            </button>
            
          </div>
          
          </div>
          
          <div className='lg:col-span-5 lg:-m-48 -m-20 overflow-hidden'>
          <Image
            src='/images/banner/banner.png'
            alt='banner image'
            width={1013}
            height={760}
          />
          </div>
          
        </div>
        {showWakey && (
            <button
              onClick={handleDbWakey}
              style={{
                alignSelf: 'flex-start',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: COLORS.accent,
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Zap size={16} /> Wakey Wakey
            </button>
          )}
        </div>
      </div>
      </div>
      

        {dbCheckResult && (
          <p style={{ fontStyle: 'italic' }}>{dbCheckResult}</p>
        )}
      {showFormModal && (
        <div className='fixed top-0 left-0 w-full h-full bg-black/60 z-50 flex justify-center items-center p-4 overflow-auto'>
          <div className='relative bg-darkmode rounded-xl w-full max-w-3xl p-6 shadow-lg'>
            <button
              onClick={() => setShowFormModal(false)}
              className='absolute top-3 right-3 text-black hover:text-red-500'>
              <Icon icon='tabler:circle-x' className='text-2xl' />
            </button>
            <GetStartedForm userGender={userGender ?? 'female'} setShowFormModal={setShowFormModal} />
          </div>
        </div>
      )}
    </section>
  )
}

export default Banner
