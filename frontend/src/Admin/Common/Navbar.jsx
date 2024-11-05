import React from 'react'
import { HiOutlineBell, HiOutlineChatAlt, HiOutlineSearch } from 'react-icons/hi'
import { Popover} from '@headlessui/react';

function Navbar() {
  return (
    <div className='bg-white h-16 px-4 flex justify-between items-center'> {/* Added 'items-center' for vertical alignment */}
        <div className='relative flex items-center'>
            <HiOutlineSearch fontSize={20} className='text-gray-400 absolute left-3' />
                <input 
                type='text' 
                placeholder='Search...' 
                className='text-sm focus:outline-none active:outline-none h-10 w-[24rem] border border-gray-300 rounded-sm pl-11 pr-4' 
                />
        </div>

        <div className='flex items-center gap-2 mr-2'> {/* Added 'items-center' for vertical alignment */}
        <Popover className="relative group">
    {({ open }) => (
      <>
        <Popover.Button className="p-1.5 rounded-sm inline-flex items-center text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100">
          <HiOutlineChatAlt fontSize={24} />
        </Popover.Button>
        <Popover.Panel className="absolute z-10 mt-2 flex flex-col bg-white border border-gray-200 rounded-lg shadow-lg w-48">
          <a href="/insights" className="px-4 py-2 text-gray-700 hover:bg-gray-100">Insights</a>
          <a href="/automations" className="px-4 py-2 text-gray-700 hover:bg-gray-100">Automations</a>
          <a href="/reports" className="px-4 py-2 text-gray-700 hover:bg-gray-100">Reports</a>
        </Popover.Panel>
      </>
    )}
  </Popover>
            


            <HiOutlineBell fontSize={24}/>
    </div>
    </div>

  )
}

export default Navbar
