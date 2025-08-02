'use client'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phnumber: '',
    Message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loader, setLoader] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)

  useEffect(() => {
    const isValid = formData.Message.trim() !== ''
    setIsFormValid(isValid)
  }, [formData])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/users')
        if (!res.ok) return
        const user = await res.json()
        if (user) {
          const [first, ...last] = user.fullName.split(' ')
          setFormData((prev) => ({
            ...prev,
            firstname: first,
            lastname: last.join(' '),
            email: user.email,
            phnumber: user.phone || '',
          }))
        }
      } catch (err) {
        console.error('Error fetching user info:', err)
      }
    }
    fetchUser()
  }, [])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const reset = () => {
    setFormData({
      firstname: '',
      lastname: '',
      email: '',
      phnumber: '',
      Message: '',
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoader(true)
    
    fetch('https://formspree.io/f/xjkrzpyr', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        Name: formData.firstname,
        LastName: formData.lastname,
        Email: formData.email,
        PhoneNo: formData.phnumber,
        Message: formData.Message,
      }),
    })
      .then(async (response) => {
        setLoader(false)
        if (response.ok) {
          toast.success(
            'Form submitted successfully!\nThank you for contacting us! We will get back to you soon.'
          )
          reset()
          setSubmitted(true)
        } else {
          const errorData = await response.json()
          console.error('Formspree Error:', errorData)
          toast.error('Submission failed. Please try again.')
        }
      })
      .catch((error) => {
        setLoader(false)
        toast.error('Something went wrong. Please try again.')
        console.log('Fetch error:', error.message)
      })
  }


  return (
    <section id='contact' className='scroll-mt-14'>
      <div className='container'>
        <div className='relative'>
          <h2 className='mb-9  capitalize'>Get in Touch</h2>
          <div className='relative border border-lightblue/35 px-6 py-2 rounded-2xl'>
            <form
              onSubmit={handleSubmit}
              className='flex flex-wrap w-full m-auto justify-between'>
              <div className='sm:flex gap-6 w-full'>
                <div className='mx-0 my-2.5 flex-1'>
                  <label htmlFor='fname' className='pb-3 inline-block text-base text-lightpurple'>
                    First Name
                  </label>
                  <input
                    id='fname'
                    type='text'
                    name='firstname'
                    value={formData.firstname}
                    readOnly
                    className='w-full bg-gray-800 text-base px-4 rounded-2xl py-2.5 border-lightblue/35 border placeholder:text-lightsky/40 text-white cursor-not-allowed'
                  />
                </div>
                <div className='mx-0 my-2.5 flex-1'>
                  <label htmlFor='lname' className='pb-3 inline-block text-base text-lightpurple'>
                    Last Name
                  </label>
                  <input
                    id='lname'
                    type='text'
                    name='lastname'
                    value={formData.lastname}
                    readOnly
                    className='w-full bg-gray-800 text-base px-4 rounded-2xl py-2.5 border-lightblue/35 border placeholder:text-lightsky/40 text-white cursor-not-allowed'
                  />
                </div>
              </div>
              <div className='sm:flex gap-6 w-full'>
                <div className='mx-0 my-2.5 flex-1'>
                  <label htmlFor='email' className='pb-3 inline-block text-base text-lightpurple'>
                    Email Address
                  </label>
                  <input
                    id='email'
                    type='email'
                    name='email'
                    value={formData.email}
                    readOnly
                    className='w-full bg-gray-800 text-base px-4 rounded-2xl py-2.5 border-lightblue/35 border placeholder:text-lightsky/40 text-white cursor-not-allowed'
                  />
                </div>
                <div className='mx-0 my-2.5 flex-1'>
                  <label htmlFor='Phnumber' className='pb-3 inline-block text-base text-lightpurple'>
                    Phone Number
                  </label>
                  <input
                    id='Phnumber'
                    type='tel'
                    name='phnumber'
                    value={formData.phnumber}
                    readOnly
                    className='w-full bg-gray-800 text-base px-4 rounded-2xl py-2.5 border-lightblue/35 border placeholder:text-lightsky/40 text-white cursor-not-allowed'
                  />
                </div>
              </div>
              <div className='w-full mx-0 my-2.5 flex-1'>
                <label htmlFor='message' className='text-base inline-block text-lightpurple'>
                  Message
                </label>
                <textarea
                  id='message'
                  name='Message'
                  value={formData.Message}
                  onChange={handleChange}
                  className='w-full mt-2 rounded-2xl px-5 py-3 border-lightblue/35 border transition-all duration-500 focus:border-primary focus:outline-0 placeholder:text-lightsky/40 text-white'
                  placeholder='Anything else you wanna communicate'></textarea>
              </div>
              <div className='mx-0 my-2.5 w-full'>
                <button
                  type='submit'
                  disabled={!isFormValid || loader}
                  className={`border leading-none px-6 text-lg font-medium py-4 rounded-full 
                    ${
                    !isFormValid || loader
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary border-primary text-white hover:bg-transparent hover:text-primary cursor-pointer'
                  }`}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactForm;