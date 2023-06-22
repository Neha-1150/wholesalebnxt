import React from 'react'
import Backbar from '../components/app/common/Backbar';

function notifications() {
  return (
    <main className='relative w-screen h-auto pt-14 pb-24'>
		<Backbar title="Notifications" className="fixed top-0 z-1 text-white bg-brand-500" />

    <div className='p-20 text-center'>No Notifications</div>
	</main>
  )
}

export default notifications