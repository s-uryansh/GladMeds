'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PostLoginPage() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      const res = await fetch('/api/auth/post-login')
      if (res.ok) {
        router.replace('/profile') 
      } else {
        router.replace('/auth/error?message=token-setup-failed')
      }
    }

    run()
  }, [])

  return (
    <div className="text-white flex justify-center items-center h-screen">
      Logging you in securely...
    </div>
  )
}
