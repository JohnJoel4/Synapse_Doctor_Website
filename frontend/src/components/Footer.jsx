import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm'>

        {/* <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>(+1) - 212-456-7890</li>
            <li>(+91) - 8309-100-300</li>
            <li>Vidyakullu@gmail.com</li>
            <li>linkedin.com/in/vidya-kollu-md-026a2340</li>  
          </ul>
        </div> */}

      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Powered by Synapse AI</p>
      </div>

    </div>
  )
}

export default Footer
