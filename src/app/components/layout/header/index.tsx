'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import HeaderLink from './navigation/HeaderLink'
import Signin from '../../auth/sign-in'
import SignUp from '../../auth/sign-up'
import MobileHeaderLink from './navigation/MobileHeaderLink'
import Logo from './logo'
import { HeaderItem } from '@/app/types/menu'

const Header: React.FC = () => {
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [sticky, setSticky] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [navlink, setNavLink] = useState<HeaderItem[]>([])
  const [user, setUser] = useState(null)

  const navbarRef = useRef<HTMLDivElement>(null)
  const signInRef = useRef<HTMLDivElement>(null)
  const signUpRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/page-data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setNavLink(data.Headerdata)
      } catch (error) {
        console.error('Error fetching service', error)
      }
    }
    fetchData()
  }, [])

const fetchUser = async () => {
  try {
    const res = await fetch('/api/auth/me', {
      credentials: 'include',
      cache: 'no-store',
    });

    if (!res.ok) {
      setUser(null); 
      return;
    }

    const data = await res.json();
    setUser(data);
  } catch (error) {
    console.error('Failed to fetch user info', error);
    setUser(null);
  }
};



  useEffect(() => {
    fetchUser()
  }, [])

  const handleScroll = () => setSticky(window.scrollY >= 10)

  const handleClickOutside = (event: MouseEvent) => {
    if (
      signInRef.current && !signInRef.current.contains(event.target as Node)
    ) setIsSignInOpen(false)
    if (
      signUpRef.current && !signUpRef.current.contains(event.target as Node)
    ) setIsSignUpOpen(false)
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node) &&
      navbarOpen
    ) setNavbarOpen(false)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [navbarOpen, isSignInOpen, isSignUpOpen])

  useEffect(() => {
    document.body.style.overflow = (isSignInOpen || isSignUpOpen || navbarOpen) ? 'hidden' : ''
  }, [isSignInOpen, isSignUpOpen, navbarOpen])

  return (
    <header className={`fixed top-0 z-40 w-full transition-all duration-300 ${
      sticky ? 'shadow-lg bg-body-bg bg-banner-image py-4' : 'shadow-none py-6'
    }`}>
      <div>
        <div className='container flex items-center justify-between'>
          <Logo />
          <nav className='hidden lg:flex grow items-center gap-8 justify-center ml-14'>
            {navlink.map((item, index) => (
              <HeaderLink key={index} item={item} />
            ))}
          </nav>
          <div className='flex items-center gap-4'>
            {user ? (
              <Link
                href="/profile"
                className="flex items-center space-x-2 text-white px-4 py-2 rounded-lg bg-primary hover:bg-transparent border border-primary hover:text-primary"
              >
                <Icon icon="mdi:account-circle" className="text-2xl" />
                <span>Profile</span>
              </Link>
            ) : (
              <>
                <Link
                  href="#"
                  className="hidden lg:block bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white duration-300 px-6 py-3 rounded-lg"
                  onClick={() => setIsSignInOpen(true)}
                >
                  Sign In
                </Link>
                <Link
                  href="#"
                  className="hidden lg:block text-white bg-linear-to-r from-secondary to-primary hover:from-primary hover:to-secondary duration-300 px-6 py-3 rounded-lg"
                  onClick={() => setIsSignUpOpen(true)}
                >
                  Sign Up
                </Link>
              </>
            )}
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className='block lg:hidden p-2 rounded-lg'
              aria-label='Toggle mobile menu'
            >
              <span className='block w-6 h-0.5 bg-white'></span>
              <span className='block w-6 h-0.5 bg-white mt-1.5'></span>
              <span className='block w-6 h-0.5 bg-white mt-1.5'></span>
            </button>
          </div>
        </div>

        {navbarOpen && <div className='fixed top-0 left-0 w-full h-full bg-black/50 z-40' />}

        <div
          ref={mobileMenuRef}
          className={`lg:hidden fixed top-0 right-0 h-full w-full bg-darkmode shadow-lg transform transition-transform duration-300 max-w-xs ${
            navbarOpen ? 'translate-x-0' : 'translate-x-full'
          } z-50`}
        >
          <div className='flex items-center justify-between p-4'>
            <Logo />
            <button
              onClick={() => setNavbarOpen(false)}
              className='hover:cursor-pointer'
              aria-label='Close menu Modal'
            >
              <Icon
                icon='tabler:currency-xrp'
                className='text-white text-xl hover:text-primary'
              />
            </button>
          </div>
          <nav className='flex flex-col items-start p-4 text-white'>
            {navlink.map((item, index) => (
              <MobileHeaderLink key={index} item={item} />
            ))}
            <div className="mt-4 flex flex-col space-y-4 w-full">
              {user ? (
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-white px-4 py-2 rounded-lg bg-primary hover:bg-transparent border border-primary hover:text-primary"
                  onClick={() => setNavbarOpen(false)}
                >
                  <Icon icon="mdi:account-circle" className="text-2xl" />
                  <span>Profile</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="#"
                    className="bg-transparent border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white"
                    onClick={() => {
                      setIsSignInOpen(true)
                      setNavbarOpen(false)
                    }}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="#"
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-transparent border border-primary hover:text-primary"
                    onClick={() => {
                      setIsSignUpOpen(true)
                      setNavbarOpen(false)
                    }}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>

        {/* Sign In Modal */}
        {isSignInOpen && (
          <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50'>
            <div
              ref={signInRef}
              className='relative mx-auto w-full max-w-md bg-purple-950/80 overflow-hidden rounded-lg px-8 pt-14 pb-8 text-center bg-simple-bg backdrop-blur-md'
            >
              <button
                onClick={() => setIsSignInOpen(false)}
                className='absolute top-0 right-0 mr-8 mt-8 cursor-pointer'
              >
                <Icon
                  icon='tabler:currency-xrp'
                  className='text-white hover:text-primary text-2xl'
                />
              </button>
              <Signin
                onSuccess={() => {
                  setIsSignInOpen(false)
                  fetchUser()
                }}
              />
            </div>
          </div>
        )}

        {/* Sign Up Modal */}
        {isSignUpOpen && (
          <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50'>
            <div
              ref={signUpRef}
              className='relative mx-auto w-full max-w-md bg-purple-950/80 overflow-hidden rounded-lg bg-simple-bg backdrop-blur-md px-8 pt-14 pb-8 text-center'
            >
              <button
                onClick={() => setIsSignUpOpen(false)}
                className='absolute top-0 right-0 mr-8 mt-8 cursor-pointer'
              >
                <Icon
                  icon='tabler:currency-xrp'
                  className='text-white hover:text-primary text-2xl'
                />
              </button>
              <SignUp
                onSuccess={() => {
                  setIsSignUpOpen(false)
                  fetchUser()
                }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
