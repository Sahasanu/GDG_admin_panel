import React from 'react'
import { Construction } from 'lucide-react';

function Settings() {
  return (
    <div className='flex items-center  justify-center h-screen'>
      <div className=' p-5 rounded-2xl   flex flex-col items-center justify-center ' >
        <Construction size={140} color='blue' />

        <div className='text-2xl font-bold' > Page is under construction </div>
      </div>
    </div>
  )
}

export default Settings