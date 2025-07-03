'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TermsModal from './TermsModal'
import { toast } from 'sonner'

interface TermsAgreementProps {
  userEmail?: string
  onSuccess?: () => void
  redirectTo?: string
}

export default function TermsAgreement({ userEmail, onSuccess, redirectTo = '/dashboard' }: TermsAgreementProps) {
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAccept = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/accept-terms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
          acceptedAt: new Date().toISOString(),
          termsVersion: '1.0'
        }),
      })

      if (response.ok) {
        toast.success('Terms accepted successfully', {
          style: {
            background: 'var(--color-darkmode)',
            color: 'var(--color-lightsky)',
            border: '1px solid var(--color-border)'
          }
        })
        setIsModalOpen(false)
        if (onSuccess) {
          onSuccess()
        } else {
          router.push(redirectTo)
        }
      } else {
        throw new Error('Failed to accept terms')
      }
    } catch (error) {
      toast.error('Failed to accept terms. Please try again.', {
        style: {
          background: 'var(--color-darkmode)',
          color: 'var(--color-lightsky)',
          border: '1px solid var(--color-border)'
        }
      })
      console.error('Error accepting terms:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDecline = () => {
    toast.error('You must accept the terms to continue using GladMeds', {
      style: {
        background: 'var(--color-darkmode)',
        color: 'var(--color-lightsky)',
        border: '1px solid var(--color-border)'
      }
    })
    router.push('/auth/signin')
  }

  if (!isModalOpen) {
    return (
      <div className="min-h-screen bg-body-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="text-lightblue mt-4">Processing your acceptance...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-body-bg">
      <TermsModal
        isOpen={isModalOpen}
        onAccept={handleAccept}
        onDecline={handleDecline}
        userEmail={userEmail}
      />
    </div>
  )
}