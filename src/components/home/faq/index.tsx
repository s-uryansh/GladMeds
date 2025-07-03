'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import { FaqType } from '@/app/types/faq'

const Faq = () => {
  const [faqdata, setFaqdata] = useState<FaqType[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/page-data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setFaqdata(data?.Faqdata)
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <section id='faq-section' className='scroll-mt-20 overflow-hidden'>
      <div className='container relative z-10'>
        <h2 className='font-bold text-center mb-5'>
          Frequently Asked Questions
        </h2>
        <p className='text-center lg:text-lg font-normal text-lightblue max-w-2xl mx-auto'>
          Have questions about trading, security, or how our platform works?
          Find clear answers to the most common inquiries to get started with
          confidence.
        </p>
        <div>
          <div className='grid lg:grid-cols-2 items-center'>
            <div>
              <div className='w-full px-4 pt-16'>
                {faqdata?.map((items, i) => (
                  <div
                    className='mx-auto w-full max-w-5xl rounded-2xl bg-darkmode py-8 px-6 mb-5'
                    key={i}>
                    <Disclosure>
                      {({ open }) => (
                        <div>
                          <DisclosureButton className='flex w-full justify-between rounded-lg text-lightpurple sm:px-4 sm:py-2 text-left md:text-2xl font-medium cursor-pointer'>
                            <span>{items.heading}</span>
                            <Icon
                              icon='tabler:chevron-up'
                              className={`${
                                open ? 'rotate-180 transform' : ''
                              } text-2xl text-purple-500`}
                            />
                          </DisclosureButton>
                          <DisclosurePanel className='px-4 pt-4 pb-2 md:text-lg text-lightblue font-normal'>
                            {items.subheading}
                          </DisclosurePanel>
                        </div>
                      )}
                    </Disclosure>
                  </div>
                ))}
              </div>
            </div>
            <div className='-m-48 absolute -right-32'>
              <Image
                src={'/images/faq/faq.svg'}
                alt='faq-image'
                width={941}
                height={379}
                className='w-auto sm:block hidden'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Faq
