'use client'
import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300)
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return (
    <>
      {isVisible && (
        <div className='fixed bottom-8 right-8 z-[999]'>
          <button
            onClick={scrollToTop}
            aria-label='Scroll to top'
            className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-md transition duration-300 ease-in-out hover:bg-primary/80'>
            <span className='mt-[2px] h-3 w-3 rotate-45 border-l-2 border-t-2 border-white'></span>
          </button>
        </div>
      )}
    </>
  )
}
