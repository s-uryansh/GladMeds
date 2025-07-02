'use client'
import { useState } from 'react'
import Link from 'next/link'
import SocialSignUp from '../SocialSignUp'
import toast from 'react-hot-toast';
import Logo from '../../layout/header/logo'

const SignUp = ({onSuccess}: {onSuccess: () => void}) => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    blood_group: '',
    phone: '',
    address: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration Failed!');
        toast.error(data.error || 'Registration Failed');

      } else {
        setSuccess('Registration Successful!')
        setForm({
          full_name: '',
          email: '',
          password: '',
          age: '',
          gender: '',
          blood_group: '',
          phone: '',
          address: '',
        })
        toast.success('Registration successful!');
        onSuccess();
      }
    } catch (err) {
      setError('Something went wrong!')
      toast.error('Something went wrong.');
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className='mb-10 text-center mx-auto inline-block max-w-[160px]'>
        <Logo />
      </div>

      <SocialSignUp />

      <span className='my-8 flex items-center justify-center text-center'>
        <span className='flex-grow border-t border-white/20'></span>
        <span className='mx-4 text-base text-white'>OR</span>
        <span className='flex-grow border-t border-white/20'></span>
      </span>

      <form onSubmit={handleSubmit}>
        <div className='mb-[22px]'>
          <input
            type='text'
            placeholder='Full Name'
            name='full_name'
            value={form.full_name}
            onChange={handleChange}
            required
            className='w-full rounded-md border border-white/20 bg-transparent px-5 py-3 text-white placeholder:text-grey focus:border-primary'
          />
        </div>

        <div className='mb-[22px]'>
          <input
            type='email'
            placeholder='Email'
            name='email'
            value={form.email}
            onChange={handleChange}
            required
            className='w-full rounded-md border border-white/20 bg-transparent px-5 py-3 text-white placeholder:text-grey focus:border-primary'
          />
        </div>

        <div className='mb-[22px]'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={form.password}
            onChange={handleChange}
            required
            className='w-full rounded-md border border-white/20 bg-transparent px-5 py-3 text-white placeholder:text-grey focus:border-primary'
          />
        </div>

        <div className='mb-[22px]'>
          <input
            type='number'
            placeholder='Age'
            name='age'
            value={form.age}
            onChange={handleChange}
            required
            className='w-full rounded-md border border-white/20 bg-transparent px-5 py-3 text-white placeholder:text-grey focus:border-primary'
          />
        </div>

        <div className='mb-[22px]'>
          <select
            name='gender'
            value={form.gender}
            onChange={handleChange}
            required
            className='w-full rounded-md border border-white/20 bg-transparent px-5 py-3 text-white focus:border-primary'>
            <option value='' disabled>
              Select Gender
            </option>
            <option value='male' className='text-black'>Male</option>
            <option value='female' className='text-black'>Female</option>
            <option value='other' className='text-black'>Other</option>
          </select>
        </div>

        <div className='mb-[22px]'>
          <select
            name='blood_group'
            value={form.blood_group}
            onChange={handleChange}
            required
            className='w-full rounded-md border border-white/20 bg-transparent px-5 py-3 text-white focus:border-primary'>
            <option value='' disabled>
              Select Blood Group
            </option>
            <option value='A+' className='text-black'>A+</option>
            <option value='A-' className='text-black'>A-</option>
            <option value='B+' className='text-black'>B+</option>
            <option value='B-' className='text-black'>B-</option>
            <option value='AB+' className='text-black'>AB+</option>
            <option value='AB-' className='text-black'>AB-</option>
            <option value='O+' className='text-black'>O+</option>
            <option value='O-' className='text-black'>O-</option>
          </select>
        </div>

        <div className='mb-[22px]'>
          <input
            type='tel'
            placeholder='Phone'
            name='phone'
            value={form.phone}
            onChange={handleChange}
            required
            className='w-full rounded-md border border-white/20 bg-transparent px-5 py-3 text-white placeholder:text-grey focus:border-primary'
          />
        </div>

        <div className='mb-[22px]'>
          <input
            type='text'
            placeholder='Address'
            name='address'
            value={form.address}
            onChange={handleChange}
            required
            className='w-full rounded-md border border-white/20 bg-transparent px-5 py-3 text-white placeholder:text-grey focus:border-primary'
          />
        </div>

        <div className='mb-9'>
          <button
            type='submit'
            disabled={loading}
            className='flex w-full items-center text-lg text-white font-medium justify-center rounded-md bg-primary px-5 py-3 hover:bg-transparent hover:text-primary border-primary border'>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </div>
      </form>

      {error && <p className='text-red-500 mb-4'>{error}</p>}
      {success && <p className='text-green-500 mb-4'>{success}</p>}

      <p className='text-white text-base'>
        By creating an account you agree to our{' '}
        <a href='/#' className='text-primary hover:underline'>
          Privacy
        </a>{' '}
        and{' '}
        <a href='/#' className='text-primary hover:underline'>
          Policy
        </a>
      </p>

      <p className='text-white text-base'>
        Already have an account?
        <Link href='/' className='pl-2 text-primary hover:underline'>
          Sign In
        </Link>
      </p>
    </>
  )
}

export default SignUp
