import Image from 'next/image'

const Trade = () => {
  return (
    <section className='overflow-hidden'>
      <div className='container relative'>
        <div className='bg-linear-to-r from-primary to-secondary hidden lg:block absolute w-full h-full top-1/2 blur-390'></div>
        <div className='grid lg:grid-cols-2 gap-x-5 items-center relative z-10'>
          <div>
            <Image
              src={'/images/trade/med.png'}
              alt='medical-dashboard-image'
              width={787}
              height={512}
            />
          </div>

          <div className='flex flex-col gap-7'>
            <h2 className='font-semibold text-center sm:text-start max-w-140 leading-14'>
              Access Your Medical Records Anytime, Anywhere
            </h2>
            <p className='lg:text-lg font-normal text-lightblue text-center sm:text-start'>
              Stay in control of your health data. View, edit, or export your medical profile and documents securely from any device — whether you’re at home, in a clinic, or on the go.
            </p>
            <div className='flex justify-center mt-5'>
              <div className='flex flex-col items-center'></div>
              <Image
                src="/images/trade/android.svg"
                alt="Android"
                width={140}
                height={140}
                style={{ height: "auto" }} 
              />
            </div>
            <div className='flex flex-col items-center'>
                <Image
                  src={'/images/trade/browser.png'}
                  alt='Browser'
                  width={140}
                  height={140}
                  style={{ height: 'auto' }}
                />
                <span className='text-sm text-white/80 mt-1'>Any Browser</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Trade
