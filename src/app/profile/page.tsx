'use client'

import React,{ useEffect, useState } from 'react'
import ChangePassword from '@/components/change-password/page';

const genderOptions = ['male', 'female', 'other']
const dropdownOptions: Record<string, string[]> = {
  marital_status: ['Single', 'Married', 'Divorced', 'Widowed'],
  id_proof_type: ['Aadhaar', 'PAN', 'Voter ID', 'Passport'],
}
const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']


const idFormats: Record<string, RegExp> = {
  Aadhaar: /^\d{12}$/,
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  'Voter ID': /^[A-Z]{3}[0-9]{7}$/,
  Passport: /^[A-Z]{1}-?\d{7}$/,
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [editedUser, setEditedUser] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [pdfs, setPdfs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  const [extendedProfile, setExtendedProfile] = useState<any>(null)
  const [editingExtended, setEditingExtended] = useState(false)
  const [editedExtendedProfile, setEditedExtendedProfile] = useState<any>(null)
  const [showHistoryForm, setShowHistoryForm] = useState(false)
  const [newHistory, setNewHistory] = useState({ title: '', description: '' })
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleAddHistory = async () => {
  if (!newHistory.title.trim()) {
    setMessage('Title is required.')
    return
  }

  const res = await fetch('/api/medical_history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(newHistory),
  })

  const result = await res.json()
  if (res.ok) {
    setMessage('Medical history added successfully!')
    setShowHistoryForm(false)
    setNewHistory({ title: '', description: '' })
  } else {
    setMessage(result.error || 'Failed to add medical history')
  }
}

  useEffect(() => {
    (async () => {
      await fetchUser()
      await fetchPDFs()
      setLoading(false)
    })()
  }, [])

  const fetchUser = async () => {
    const res = await fetch('/api/users', { credentials: 'include', cache: 'no-store' })
    const data = await res.json()
    setUser(data)
    setEditedUser(data)
  }

  const fetchPDFs = async () => {
    const res = await fetch('/api/users/pdfs', { credentials: 'include', cache: 'no-store' })
    const data = await res.json()
    setPdfs(data.pdfs || [])
  }

  const fetchExtendedProfile = async () => {
    const res = await fetch('/api/users/profile', { credentials: 'include', cache: 'no-store' })
    if (!res.ok) {
      setMessage('No extended profile found.')
      return
    }
    const data = await res.json()
    setExtendedProfile(data)
    setEditedExtendedProfile(data)
    setShowDetails(true)
  }

  const updateUser = async () => {
    const res = await fetch('/api/update_user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(editedUser),
    })
    const result = await res.json()
    if (res.ok) {
      setUser(editedUser)
      setEditing(false)
      setMessage('Profile updated successfully!')
    } else {
      setMessage(result.error || 'Failed to update profile')
    }
  }

  const updateExtendedProfile = async () => {
    const cleaned = { ...editedExtendedProfile }
    delete cleaned.created_at
    delete cleaned.updated_at

    const res = await fetch('/api/update_extended_profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(cleaned),
    })
    const result = await res.json()
    if (res.ok) {
      setExtendedProfile(editedExtendedProfile)
      setEditingExtended(false)
      setMessage('Extended profile updated successfully!')
    } else {
      setMessage(result.error || 'Failed to update extended profile')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditedUser((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleExtendedInputChange = (key: string, value: string) => {
    if (key === 'id_proof_number') {
      const idType = editedExtendedProfile.id_proof_type
      if (idType) {
        const format = idFormats[idType]
        if (format && !format.test(value)) {
          setMessage(`Invalid ${idType} number`)
        } else {
          setMessage('')
        }
      }
    }
    setEditedExtendedProfile((prev: any) => ({ ...prev, [key]: value }))
  }

  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const formData = new FormData()
    Array.from(e.target.files).forEach((file) => formData.append('pdf_files', file))
    const res = await fetch('/api/upload_pdf', { method: 'POST', credentials: 'include', body: formData })
    if (res.ok) {
      setMessage('Upload successful!')
      fetchPDFs()
    } else {
      setMessage('Upload failed')
    }
  }

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    if (res.ok) {
      window.location.href = '/'
    } else {
      setMessage('Failed to logout')
    }
  }

  if (loading) return <div className="p-10 text-lightblue text-center">Loading...</div>
  if (!user) return <div className="p-10 text-red-400 text-center">You must be signed in to view this page.</div>

  const fieldsOrder = ['full_name', 'email', 'age', 'gender', 'blood_group', 'phone', 'address']

  return (
    <section className="min-h-screen bg-body-bg text-lightblue">
      <div className="container mt-24 mb-12">
        <div className="bg-darkmode border border-border rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-lightsky text-3xl font-bold mb-6">Profile</h1>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {fieldsOrder.map((key) => (
              <div key={key} className="flex flex-col">
                <label className="text-white font-medium capitalize">{key.replace(/_/g, ' ')}:</label>
                {editing ? (
                    key === 'gender' ? (
                      <select
                        name="gender"
                        value={editedUser.gender || ''}
                        onChange={handleInputChange}
                        className="bg-body-bg border border-border text-white px-4 py-2 rounded-lg mt-1"
                      >
                        <option value="">Select Gender</option>
                        {genderOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : key === 'blood_group' ? (
                      <select
                        name="blood_group"
                        value={editedUser.blood_group || ''}
                        onChange={handleInputChange}
                        className="bg-body-bg border border-border text-white px-4 py-2 rounded-lg mt-1"
                      >
                        <option value="">Select Blood Group</option>
                        {bloodGroupOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name={key}
                        value={editedUser[key] || ''}
                        onChange={handleInputChange}
                        className="bg-body-bg border border-border text-white px-4 py-2 rounded-lg mt-1"
                      />
                    )
                  ) : (
                    <p className="text-lightblue mt-1">{user[key]}</p>
                  )}

              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-4">
            {editing ? (
              <>
                <button onClick={updateUser} className="bg-primary px-6 py-2 rounded-lg text-white hover:bg-secondary">Save</button>
                <button onClick={() => { setEditedUser(user); setEditing(false) }} className="border border-red-400 text-red-400 px-6 py-2 rounded-lg hover:bg-red-600 hover:text-white">Cancel</button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="bg-primary px-6 py-2 rounded-lg text-white hover:bg-secondary">Edit Profile</button>
            )}
            <button
            className="bg-primary px-6 py-2 rounded-lg text-white hover:bg-secondary"
            onClick={() => setShowChangePassword(true)}
          >
            Change Password
          </button>
            <button onClick={fetchExtendedProfile} className="px-6 py-2 bg-secondary hover:bg-primary text-white rounded-lg">View More Details</button>
          </div>
          {/* Change Password */}
          {showChangePassword && (
            <ChangePassword onClose={() => setShowChangePassword(false)} />
          )}
          {/* Extended Profile */}
          {showDetails && editedExtendedProfile && (
            <div className="mt-8 p-6 bg-body-bg border border-border rounded-xl">
              <h3 className="text-lightsky text-2xl font-semibold mb-4">Extended Profile Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(editedExtendedProfile).filter(([key]) => {
                  if (['id', 'user_id', 'created_at', 'updated_at'].includes(key)) return false
                  if (key === 'menstrual_info' && user.gender !== 'female') return false
                  return true
                }).map(([key, value]) => {
                  const isDate = key === 'date_of_birth'
                  const formattedKey = key.replace(/_/g, ' ')
                  const options = dropdownOptions[key]
                  const inputValue = isDate && typeof value === 'string' ? new Date(value).toISOString().split('T')[0] : value || ''
                  return (
                    <div key={key}>
                      <label className="text-white font-medium capitalize">{formattedKey}:</label>
                      {editingExtended ? (
                        options ? (
                          <select name={key} value={inputValue as string} onChange={(e) => handleExtendedInputChange(key, e.target.value)} className="bg-body-bg border border-border text-white px-4 py-2 rounded-lg mt-1">
                            <option value="">Select {formattedKey}</option>
                            {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        ) : (
                          <input type={isDate ? 'date' : 'text'} name={key} value={inputValue as string} onChange={(e) => handleExtendedInputChange(key, e.target.value)} className="bg-body-bg border border-border text-white px-4 py-2 rounded-lg mt-1" />
                        )
                      ) : (
                        <p className="text-lightblue mt-1">{isDate && typeof value === 'string' ? new Date(value).toLocaleDateString('en-IN') : String(value || 'N/A')}</p>
                      )}
                    </div>
                  )
                })}
              </div>
              {editingExtended ? (
                <div className="mt-4 flex gap-4">
                  <button onClick={updateExtendedProfile} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary">Save Extended Info</button>
                  <button onClick={() => { setEditedExtendedProfile(extendedProfile); setEditingExtended(false) }} className="border border-red-400 text-red-400 px-6 py-2 rounded-lg hover:bg-red-600 hover:text-white">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setEditingExtended(true)} className="mt-4 bg-secondary hover:bg-primary text-white px-6 py-2 rounded-lg">Edit Extended Info</button>
              )}
            </div>
          )}
            {/* Medical History */}
<div className="mt-10">
  <button
    onClick={() => setShowHistoryForm((prev) => !prev)}
    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary"
  >
    {showHistoryForm ? 'Cancel' : 'Add your medical history'}
  </button>

  {showHistoryForm && (
    <div className="mt-6 bg-body-bg border border-border p-6 rounded-xl space-y-4">
      <div>
        <label className="text-white font-medium">Title:</label>
        <input
          type="text"
          value={newHistory.title}
          onChange={(e) => setNewHistory((prev) => ({ ...prev, title: e.target.value }))}
          className="mt-1 w-full bg-body-bg border border-border text-white px-4 py-2 rounded-lg"
          placeholder="e.g., Diabetes Diagnosis"
        />
      </div>
      <div>
        <label className="text-white font-medium">Description:</label>
        <textarea
          value={newHistory.description}
          onChange={(e) => setNewHistory((prev) => ({ ...prev, description: e.target.value }))}
          className="mt-1 w-full bg-body-bg border border-border text-white px-4 py-2 rounded-lg"
          rows={4}
          placeholder="Add any additional notes or context..."
        />
      </div>
      <button
        onClick={handleAddHistory}
        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary"
      >
        Submit Medical History
      </button>
    </div>
  )}
</div>


          {/* File Upload */}
          <div className="mt-10 mb-8">
            <label className="block font-semibold text-lightsky mb-2">Upload More PDFs</label>
            <input type="file" multiple accept="application/pdf" onChange={handlePDFUpload} className="block w-full text-sm text-lightblue file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-secondary" />
          </div>

          {/* PDF List */}
          <div>
            <h2 className="text-white text-xl font-semibold mb-4">Your Uploaded PDFs</h2>
            {pdfs.length === 0 ? <p className="text-lightblue">No PDFs uploaded yet.</p> : (
              <ul className="space-y-3">
                {pdfs.map((pdf) => (
                  <li key={pdf.id} className="bg-tablebg border border-border p-4 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-lightpurple font-medium">{pdf.file_name}</p>
                      <p className="text-xs text-lightblue">Uploaded: {new Date(pdf.uploaded_at).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-3">
                      <a href={pdf.file_path} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-secondary">View</a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          

          {/* Message */}
          {message && <div className="mt-6 text-green-400 font-semibold text-center">{message}</div>}

          {/* Logout */}
          <div className="mt-6 text-center">
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300">Logout</button>
          </div>
        </div>
      </div>
    </section>
  )
}