'use client'

import { useState } from 'react'

interface TermsModalProps {
  isOpen: boolean
  onAccept: () => void
  onDecline: () => void
  userEmail?: string
}

export default function TermsModal({ isOpen, onAccept, onDecline }: TermsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-body-bg/90 flex items-center justify-center z-50 p-4">
      <div className="bg-darkmode rounded-lg shadow-mentor-shadow max-w-4xl w-full max-h-[80vh] overflow-hidden border border-border">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-lightsky">Terms of Service</h2>
        </div>
        
        {/* Scrollable Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[60vh] bg-darkmode">
          <div className="space-y-4 text-sm text-lightblue">
            <h3 className="text-lg font-semibold text-white">GladMeds Terms of Service</h3>
            <p className="text-lightblue">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section>
              <h4 className="font-semibold mb-2 text-lightsky">1. Acceptance of Terms</h4>
              <p className="text-lightblue">By accessing and using GladMeds, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>

            <section>
              <h4 className="font-semibold mb-2 text-lightsky">2. Medical Disclaimer</h4>
              <p className="text-lightblue">GladMeds is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
            </section>

            <section>
              <h4 className="font-semibold mb-2 text-lightsky">3. User Responsibilities</h4>
              <ul className="list-disc pl-6 space-y-1 text-lightblue">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the service only for lawful purposes</li>
                <li>Not share your account with others</li>
              </ul>
            </section>

            <section>
              <h4 className="font-semibold mb-2 text-lightsky">4. Privacy and Data Protection</h4>
              <p className="text-lightblue">Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.</p>
            </section>

            <section>
              <h4 className="font-semibold mb-2 text-lightsky">5. Prescription and Medical Services</h4>
              <p className="text-lightblue">All prescription services are provided by an AI. This is not a substitute for professional medical advice.</p>
            </section>

            <section>
              <h4 className="font-semibold mb-2 text-lightsky">6. Data Security and HIPAA Compliance</h4>
              <p className="text-lightblue">We maintain strict data security to protect your health information.</p>
            </section>

            <section>
              <h4 className="font-semibold mb-2 text-lightsky">7. Service Availability</h4>
              <p className="text-lightblue">While we strive for 24/7 availability, services may be temporarily unavailable due to maintenance or technical issues.</p>
            </section>

            <section>
              <h4 className="font-semibold mb-2 text-lightsky">8. Contact Information</h4>
              <p className="text-lightblue">For questions about these Terms of Service, please contact us at <span className="text-primary">legalgladmeds@gmail.com</span></p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-tablebg flex justify-end space-x-3 border-t border-border">
          <button
            onClick={onDecline}
            className="px-4 py-2 text-sm font-medium text-lightblue bg-transparent border border-border rounded-md hover:bg-border hover:text-white transition-colors"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 text-sm font-medium text-white bg-primary border border-primary rounded-md hover:bg-transparent hover:text-primary transition-colors"
          >
            Accept Terms
          </button>
        </div>
      </div>
    </div>
  )
}