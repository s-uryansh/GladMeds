'use client'

import React, { useState } from 'react'

type FormInputs = {
  date_of_birth: string
  marital_status: string
  id_proof_type: string
  id_proof_number: string
  occupation: string
  nationality: string
  guardian_name: string
  guardian_relation: string
  guardian_phone: string
  religion: string
  preferred_language: string[]
  known_allergies: string
  chronic_conditions: string
  past_surgeries: string
  current_medications: string
  immunization_status: string
  family_medical_history: string
  lifestyle_details: string
  menstrual_info: string
  pdf_files: File[]
}

const idFormats: Record<string, RegExp> = {
  Aadhaar: /^\d{12}$/,
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  'Voter ID': /^[A-Z]{3}[0-9]{7}$/,
  Passport: /^[A-Z]{1}-?\d{7}$/,
}

const maritalOptions = ['Single', 'Married', 'Divorced', 'Widowed']
const idOptions = ['Aadhaar', 'PAN', 'Voter ID', 'Passport']

type Props = {
  userGender: string
  setShowFormModal: (value: boolean) => void
}

const GetStartedForm: React.FC<Props> = ({ userGender, setShowFormModal }) => {
  const [formData, setFormData] = useState<FormInputs>({
    date_of_birth: '',
    marital_status: '',
    id_proof_type: '',
    id_proof_number: '',
    occupation: '',
    nationality: '',
    guardian_name: '',
    guardian_relation: '',
    guardian_phone: '',
    religion: '',
    preferred_language: [],
    known_allergies: '',
    chronic_conditions: '',
    past_surgeries: '',
    current_medications: '',
    immunization_status: '',
    family_medical_history: '',
    lifestyle_details: '',
    menstrual_info: '',
    pdf_files: [],
  })

  const [idError, setIdError] = useState('')
  const [message, setMessage] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, multiple, selectedOptions, type } = e.target as HTMLSelectElement

    if (multiple) {
      const values = Array.from(selectedOptions).map((opt) => opt.value)
      setFormData((prev) => ({ ...prev, [name]: values }))
    } else {
      // Validate ID format
      if (name === 'id_proof_number' && formData.id_proof_type) {
        const format = idFormats[formData.id_proof_type]
        setIdError(format && !format.test(value) ? `Invalid ${formData.id_proof_type} number` : '')
      }

      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setFormData((prev) => ({
      ...prev,
      pdf_files: Array.from(files),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (idError) return

    const data = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'pdf_files') {
        (value as File[]).forEach((file) => data.append('pdf_files', file))
      } else if (Array.isArray(value)) {
        value.forEach((val) => data.append(`${key}[]`, val))
      } else {
        data.append(key, value)
      }
    })

    const res = await fetch('/api/get-started', {
      method: 'POST',
      body: data,
    })

    const result = await res.json()
    if (res.ok) {
      setMessage('Profile uploaded successfully!')
      setTimeout(() => {
        setShowFormModal(false)
      }, 1500)
    } else {
      setMessage(result.error || 'Upload failed')
    }
  }

  const excludedFields = [
    'date_of_birth',
    'marital_status',
    'id_proof_type',
    'id_proof_number',
    'pdf_files',
    'menstrual_info',
  ]

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6 max-w-3xl mx-auto p-6 bg-darkmode rounded-2xl shadow-2xl text-white'>
      <h2 className='text-lightsky text-3xl font-bold text-center mb-4'>
        Get Started
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Date of Birth */}
        <input
          type='date'
          name='date_of_birth'
          value={formData.date_of_birth}
          onChange={handleChange}
          className='bg-body-bg border border-border text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary'
        />

        {/* Marital Status */}
        <select
          name='marital_status'
          value={formData.marital_status}
          onChange={handleChange}
          className='bg-body-bg border border-border text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary'>
          <option value=''>Select Marital Status</option>
          {maritalOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        {/* ID Proof Type */}
        <select
          name='id_proof_type'
          value={formData.id_proof_type}
          onChange={handleChange}
          className='bg-body-bg border border-border text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary'>
          <option value=''>Select ID Proof</option>
          {idOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        {/* ID Proof Number */}
        <input
          type='text'
          name='id_proof_number'
          placeholder='ID Proof Number'
          value={formData.id_proof_number}
          onChange={handleChange}
          className='bg-body-bg border border-border text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary'
        />
        {idError && <p className='text-red-400 col-span-2'>{idError}</p>}

        {/* Remaining Text Inputs */}
        {Object.entries(formData)
          .filter(([key]) => !excludedFields.includes(key))
          .map(([key, value]) => (
            <input
              key={key}
              type='text'
              name={key}
              placeholder={key.replace(/_/g, ' ')}
              value={typeof value === 'string' ? value : ''}
              onChange={handleChange}
              className='bg-body-bg border border-border placeholder:text-lightblue text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary'
            />
          ))}

        {/* Show Menstrual Info only if female */}
        {userGender === 'female' && (
          <input
            type='text'
            name='menstrual_info'
            placeholder='Menstrual Info'
            value={formData.menstrual_info}
            onChange={handleChange}
            className='bg-body-bg border border-border placeholder:text-lightblue text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary'
          />
        )}
      </div>

      {/* File Upload */}
      <div>
        <label className='block mb-2 font-semibold text-lightsky'>
          Upload PDF Files
        </label>
        <input
          type='file'
          name='pdf_files'
          multiple
          accept='application/pdf'
          onChange={handleFileChange}
          className='block w-full text-sm text-lightblue file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-secondary'
        />
      </div>

      {/* Submit */}
      <button
        type='submit'
        className='w-full bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-secondary transition-all duration-300'>
        Submit
      </button>

      {message && (
        <p className='text-center mt-4 text-green-400 font-medium'>{message}</p>
      )}
    </form>
  )
}

export default GetStartedForm
