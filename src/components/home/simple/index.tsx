import Link from 'next/link'

const Simple = () => {
  return (
    <section className='bg-simple-bg relative before:absolute before:w-full before:h-full before:bg-arrow-bg before:bg-no-repeat before:top-10'>
      <div className=''>
        <div className='container relative z-10'>
          <div className='max-w-2xl mx-auto'>
            <h2 className='text-center font-semibold mb-6 sm:leading-16 capitalize'>
              A Simple, Secure Way to Manage Your Medical Profile
            </h2>
            <p className='text-center text-lightpurple text-lg font-normal mb-8'>
              Add your health information and upload medical records with confidence. Everything stays private, encrypted, and ready for export whenever you need it — for hospitals, travel, or emergencies.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Simple
